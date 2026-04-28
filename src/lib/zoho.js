function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export async function getZohoAccessToken() {
  const clientId = getRequiredEnv('ZOHO_CLIENT_ID');
  const clientSecret = getRequiredEnv('ZOHO_CLIENT_SECRET');
  const refreshToken = getRequiredEnv('ZOHO_REFRESH_TOKEN');
  const accountBase = getRequiredEnv('ZOHO_ACCOUNT_BASE');
  const creatorBase = getRequiredEnv('ZOHO_CREATOR_BASE');

  const tokenResponse = await fetch(
    `${accountBase}/oauth/v2/token?refresh_token=${encodeURIComponent(refreshToken)}&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&grant_type=refresh_token`,
    { method: 'POST' }
  );

  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok || !tokenData.access_token) {
    const message = tokenData.error || tokenData.error_description || 'Unable to obtain Zoho access token';
    throw new Error(message);
  }

  return tokenData.access_token;
}

export async function submitZohoContact(contact) {
  const creatorBase = getRequiredEnv('ZOHO_CREATOR_BASE');
  const accountName = getRequiredEnv('ZOHO_OWNER_NAME');
  const appName = getRequiredEnv('ZOHO_APP_LINK_NAME');
  const formLinkName = getRequiredEnv('ZOHO_FORM_LINK_NAME');
  const accessToken = await getZohoAccessToken();

  const response = await fetch(
    `${creatorBase}/creator/v2.1/data/${encodeURIComponent(accountName)}/${encodeURIComponent(appName)}/form/${encodeURIComponent(formLinkName)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
        environment: 'development'
      },
      body: JSON.stringify({
        data: [
          {
            Full_Name: contact.fullName,
            Email: contact.email,
            Phone_Number: contact.phone || '',
            Company_Name: contact.companyName || '',
            Message: contact.message,
            Source: 'Website Contact Form',
          },
        ],
      }),
    }
  );

  const responseData = await response.json().catch(() => ({}));
  const topLevelCode = responseData?.code;
  const resultCode = responseData?.result?.[0]?.code;
  const isSuccessCode = topLevelCode === 3000 || resultCode === 3000;

  if (!response.ok || !isSuccessCode) {
    const message =
      responseData?.message ||
      responseData?.result?.[0]?.message ||
      responseData?.result?.[0]?.error ||
      responseData?.error ||
      responseData?.details?.message ||
      responseData?.code ||
      responseData?.result?.[0]?.code ||
      responseData?.error ||
      'Zoho request failed';
    throw new Error(`${message} (code: ${resultCode || topLevelCode || 'unknown'})`);
  }

  return responseData;
}
