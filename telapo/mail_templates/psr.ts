export const PW_RESET_TEMPLATE = ({
  displayName,
  link,
}: {
  displayName: string;
  link: string;
}) => `<table
  style="
    width: 100%;
    background-color: #f7f7f7;
    font-family: Arial, sans-serif;
    padding: 20px;
  "
>
  <tr>
    <td align="center">
      <table
        style="
          width: 600px;
          background-color: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        "
      >
        <!-- Header -->
        <tr>
          <td
            style="background-color: #ff6f61; padding: 20px; text-align: center"
          >
            <h1 style="color: #ffffff; margin: 0; font-size: 24px">
              🎄 Secret Santa 🎁
            </h1>
          </td>
        </tr>
        <!-- Content -->
        <tr>
          <td style="padding: 30px; text-align: center">
            <p style="font-size: 18px; color: #333333; margin: 0 0 15px">
              Hi <strong>${displayName}</strong>,
            </p>
            <p style="font-size: 16px; color: #555555; margin: 0 0 25px">
              We heard you lost your sleigh to the North Pole! Don’t worry, you
              can reset your password and get back to the festivities in no
              time.
            </p>
            <a
              href="${link}"
              style="
                display: inline-block;
                padding: 12px 20px;
                color: #ffffff;
                background-color: #ff6f61;
                border-radius: 5px;
                text-decoration: none;
                font-size: 16px;
                font-weight: bold;
              "
            >
              Reset Password
            </a>
            <p style="font-size: 14px; color: #999999; margin: 25px 0 0">
              If you didn’t request this, you can safely ignore it. Your
              password won’t change.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td
            style="background-color: #f7f7f7; padding: 20px; text-align: center"
          >
            <p style="font-size: 14px; color: #999999; margin: 0">
              Need help? Contact us at
              <a
                href="mailto:support@secretsanta.com"
                style="color: #ff6f61; text-decoration: none"
                >support@secretsanta.com</a
              >
            </p>
            <p style="font-size: 14px; color: #999999; margin: 5px 0 0">
              © 2024 Secret Santa. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
