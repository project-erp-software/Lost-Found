export async function onRequestGet(context) {
    const { env } = context;

    const data = await env.LOST_FOUND_KV.get('items');

    return new Response(data || "[]", {
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export async function onRequestPost(context) {
    const { request, env } = context;

    const newItem = await request.json();

    // Convert Base64 → Binary
    const base64Data = newItem.image.split(',')[1];

    const imageBuffer = Uint8Array.from(
        atob(base64Data),
        c => c.charCodeAt(0)
    );

    const fileName = `item_${Date.now()}.jpg`;

    await env.LOST_FOUND_R2.put(fileName, imageBuffer, {
        httpMetadata: {
            contentType: 'image/jpeg'
        }
    });

    newItem.image =
        `https://pub-4523718d07a940bcbd90eeaf33746f41.r2.dev/${fileName}`;

    // Read existing items
    const existingData =
        await env.LOST_FOUND_KV.get('items');

    const itemsArray =
        existingData ? JSON.parse(existingData) : [];

    // Add new item
    itemsArray.unshift(newItem);

    await env.LOST_FOUND_KV.put(
        'items',
        JSON.stringify(itemsArray)
    );

    return new Response(
        JSON.stringify({
            success: true,
            item: newItem
        }),
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}