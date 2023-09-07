const admin = require("firebase-admin")

admin.initializeApp({
    credential: admin.credential.cert({
        "type": "service_account",
        "project_id": "shadabstore",
        "private_key_id": "810d75baec24c2bb060c03e43f41f6b3a8cedd30",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCe+XKAJx6+W3lZ\nUwWUpnnaYuWZ7CdvEkdiQ6DqKl4zQm9IALlqUQh8y4qlQA4e/edotGLBWZPVsKNF\nNyfZAek/JY+iQnM+LurVrogB0E2gBHhRC+nEZG6fxANsaBdk3l2RliNBS3QEyhhb\nUf9/xmm9dP9JVKT1CBUoN6ZV94Bqo22e3AfwmX4AFHLttsCchpZNeHDwUsxhEExs\nK4ejNRZfuBWaW1/SCVPXy8iiK6yHG30fNCgXetqM5zdN2yCJgULtwEG/JisOoBSz\n7PAHgc8rviSaBD+9cJhecVDTqq5Vo+zBT9274KCIzZs1FOSn0TjuukAThXsoUmFJ\nrn/8gdxpAgMBAAECggEAMvvZBtSE/ZOklUsU7Rl+1tUEwZqFAxAfqJn7z12LHHFf\n8v2YeUpHqI42hszGOpY/UssXKN8rlEqz8gzAUM5WGZRYPjeFchnl4mW45KwDWSBV\n3dguPnffKonYdzni1syhwYEfCV/Dc43ExfTENhxR6RrOjJwC0zqmXmGKjON1Yb1K\ninVK5l+FU3ED5vslI58S0x/6BzvBBdyN1fDvbfkct2JxBYaGlR973UIdPKOZrOjo\nESLJmn0KDrqDUoVtlNgGyJRn7gl2vXqzacH2dx7JqT1K59DvJuK1974FzYFZL7sj\nogCuazb0MdeC8dcmlAGzEzgVGJomKX3eCrTM0NMJaQKBgQDOYN00DxI1zRqRlWsZ\noJVR/pZqCflteLMeBcMOBk02q9JZJPteI7I0v3jO5Gmyj0uKwfuz83+JiO92LXlh\nkE8ozkzl8/3APD0hIpRKPkKtrzilKOZGfEw+V5TvbR4Sn47w5vaA5i6Ry8ajCFnB\nrE0VkfXPcEpep3cBKf0K+Pid2wKBgQDFMr47iYKoQ3a1keTy4XwdIn01/1hebNbW\n0c1h05ArT3JcppZ/rPNzz3BlgENAYwONx+hAVeM9+AADCEGW5dWQCuaNF81TU8UJ\n4EGTbgb4qJoB2ijgC0JaVoS20BAk6xwhCW7qid7KNC0I3oi0yawNFgk0Ywbl/Wjd\nTaBDwyd8CwKBgQDMpkk0Qm2wZD8gdqbJtu/bazYE2Pc6kyIrd1NBKQaQXDouo/mQ\nFJ22qNhHcUFPC8HBSzMp8yBZZizvZ5CiKtQUht7CePz8D8Aeh4e9R5gfW040mSYg\nZ0nD2F2cPvw/Q3IfeSigEaHEeenz6Wf4IcAez6qNlbBpxG7B/L0skE8ZWQKBgQCP\nbyJJgfLkWvXcibsDIxm4w15ZyVpIjFgUNtRxxIXHyui/FXjAc1c9NHRnj8za52ot\nVWvMZ+x7JYk0q2uxy4j0VcludRKm+naGgXSRPOWbNl+W200B8Y6Y0PeFVX94qv5x\n1T+1HwVLBHqBSgQbo9keR5n4XdMltJXy6kSZJTjyEwKBgGlNvuBG1ngWtb1APvAc\n0ychde/KKD+Ej04ntfyh8ABfnCTakY+A1HA2Ha7GTOdtsLwcUYcnYgDHaY2iqIhe\nDLsqYxMY5bmqCU49AFxTg6KiCE1M9W0JIN6Z8k61rIFvDlTauUJfEg/+4312LlMG\n7pKjpV/r0+i/9/DxY+4Bzl1Z\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-lvwbc@shadabstore.iam.gserviceaccount.com",
        "client_id": "118265954215261655352",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-lvwbc%40shadabstore.iam.gserviceaccount.com"
    })
});


const SendNotification = (title, body,token) => {

    const registrationToken = ['eFPnwUkSSjyG7xxp8atWcS:APA91bFgsuXFemkdZ8_TXEH0CsJPqsDPPOGjEFaCSeZfK8Y5Y5WvbuVn36_tBlKLmu_GBWqxqRFQQ1ETNHwMV9-wip00NOF8LDUUpayYxvkokiinkuA6CggFLwdQPm3SctoiKMqPWrDr'];

    const message = {
        notification: {
            title: title,
            body: body
        },
        token: token
    };

    // Send a message to the device corresponding to the provided
    // registration token.

    admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });

}

module.exports = SendNotification