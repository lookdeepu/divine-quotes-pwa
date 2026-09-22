import webpush from "web-push";

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject = process.env.VAPID_SUBJECT || "mailto:admin@example.com";

if (publicKey && privateKey) {
  webpush.setVapidDetails(subject, publicKey, privateKey);
}

const subscriptions = new Map();

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, service: "divine-quotes-web-push" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!publicKey || !privateKey) {
    return res.status(500).json({ error: "VAPID keys are not configured" });
  }

  const { action, subscription, payload } = req.body || {};

  if (action === "subscribe") {
    if (!subscription?.endpoint) {
      return res.status(400).json({ error: "Invalid subscription" });
    }
    subscriptions.set(subscription.endpoint, subscription);
    return res.status(201).json({ ok: true });
  }

  if (action === "send") {
    const results = await Promise.allSettled(
      [...subscriptions.values()].map((sub) =>
        webpush.sendNotification(sub, JSON.stringify(payload || {
          title: "Divine Quotes",
          body: "Your daily wisdom is ready."
        }))
      )
    );

    return res.status(200).json({
      sent: results.filter((r) => r.status === "fulfilled").length,
      failed: results.filter((r) => r.status === "rejected").length
    });
  }

  return res.status(400).json({ error: "Unknown action" });
}
