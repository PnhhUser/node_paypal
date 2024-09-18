const axios = require("axios");
const { application } = require("express");

async function generateAccessToken() {
  const res = await axios({
    url: `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
    method: "post",
    data: "grant_type=client_credentials",
    auth: {
      username: process.env.PAYPAL_CLIENT_ID,
      password: process.env.PAYPAL_SECRET,
    },
  });

  return res.data.access_token;
}

const createOrder = async () => {
  const accessToken = await generateAccessToken();

  const res = await axios({
    url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    data: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          items: [
            {
              name: "nodejs paypal",
              description: "nodejs paypal",
              quantity: 1,
              unit_amount: {
                currency_code: "USD",
                value: "100.00",
              },
            },
          ],

          amount: {
            currency_code: "USD",
            value: "100.00",
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: "100.00",
              },
            },
          },
        },
      ],

      application_context: {
        return_url: process.env.BASE_URL + "/complete-order",
        cancel_url: process.env.BASE_URL + "/cancel-order",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
        brand_name: "huy hoang shop",
      },
    }),
  });

  return res.data.links.find((link) => link.rel === "approve").href;
};

const capturePaypal = async (orderId) => {
  const accessToken = await generateAccessToken();
  const res = await axios({
    url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });

  return res.data;
};

module.exports = {
  createOrder,
  capturePaypal,
};
