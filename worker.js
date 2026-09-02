const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
});

async function paystackInitialize(env, body) {
  if (!env.PAYSTACK_SECRET_KEY) {
    return json({ demo: true, provider: 'paystack', reference: body.reference });
  }
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: body.email,
      amount: Math.round(Number(body.amount) * 100),
      currency: body.currency || 'NGN',
      reference: body.reference,
      first_name: body.firstName,
      last_name: body.lastName,
      phone: body.phone,
      metadata: { fulfillment: body.fulfillment, items: body.items, notes: body.notes || '' }
    })
  });
  const data = await response.json();
  if (!response.ok || !data.status) return json({ error: data.message || 'Unable to initialize Paystack transaction.' }, 502);
  return json({ authorization_url: data.data.authorization_url, reference: data.data.reference, provider: 'paystack' });
}

async function flutterwaveInitialize(env, body) {
  if (!env.FLW_SECRET_KEY) {
    return json({ demo: true, provider: 'flutterwave', reference: body.reference });
  }
  const response = await fetch('https://api.flutterwave.com/v3/payments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.FLW_SECRET_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tx_ref: body.reference,
      amount: Number(body.amount),
      currency: body.currency || 'NGN',
      redirect_url: new URL('/?payment=complete', body.origin).toString(),
      customer: { email: body.email, phonenumber: body.phone, name: `${body.firstName} ${body.lastName}`.trim() },
      meta: { fulfillment: body.fulfillment, items: body.items, notes: body.notes || '' },
      customizations: { title: 'Morsel Pastry Studio', description: 'Morsel order', logo: `${new URL('/assets/morsel-logo-mark.svg', body.origin)}` }
    })
  });
  const data = await response.json();
  if (!response.ok || data.status !== 'success') return json({ error: data.message || 'Unable to initialize Flutterwave transaction.' }, 502);
  return json({ checkout_url: data.data.link, reference: body.reference, provider: 'flutterwave' });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/health') return json({ ok: true, service: 'morsel', mode: env.PAYSTACK_SECRET_KEY || env.FLW_SECRET_KEY ? 'configured' : 'demo' });
    if (request.method === 'POST' && (url.pathname === '/api/paystack/initialize' || url.pathname === '/api/flutterwave/initialize')) {
      try {
        const body = await request.json();
        body.origin = url.origin;
        if (!body.email || !body.amount || !body.reference) return json({ error: 'Missing payment details.' }, 400);
        return url.pathname.includes('paystack') ? await paystackInitialize(env, body) : await flutterwaveInitialize(env, body);
      } catch (error) {
        return json({ error: 'Invalid checkout request.' }, 400);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
