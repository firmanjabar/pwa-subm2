var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BIAdhZ7nFOum1Qg5y3sYs8nA_BeCed6mxPQQvdWDGAqpdWV6oqAESl8ZHe7gPG_c4a5qNm7PEc1fvrsX_uxc2mc",
    "privateKey": "XCHTY05rasJG0qvgBDGcBLtCAJZt4NjGSorKZHERRq4"
};


webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/dDGZD0b7eBQ:APA91bHqFF8DAnKv_K4KgJMc83J4-oFNXDWD7Qh0gx5h2dxidy6AoiYDEIwAFBOajYLcod6WnaZnDmunbqzaMA6KXYWCp4zTVtHlJn7Q-k7SYozfmS1nV0ZLBCJ_yUDpx5ItndW0Xj5i",
    "keys": {
        "p256dh": "BKijSNsMpeq0tsMY9XLPN1Njx2fSNIcrBhRygP0LPz78WSMsmXIINi7q1Jg5IpTS2gtEO3VsBYqVegr9UZQGFsA=",
        "auth": "LAMJI2PTWMs2xM2ZhHw4gw=="
    }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

var options = {
    gcmAPIKey: '988799844009',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);