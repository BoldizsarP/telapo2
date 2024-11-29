export const drewTemplate = ({
  displayName,
  recipientName,
}: {
  displayName: string;
  recipientName: string;
}) => `<!DOCTYPE html>
<html>
  <head>
    <title>🎅 Your Secret Santa Match Awaits! 🎁</title>
    <meta charset="UTF-8" />
    <style>
      /* Inline styles for better email compatibility */
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: auto;
      }
      .header {
        background-color: #f2f2f2;
        padding: 20px;
        text-align: center;
      }
      .content {
        padding: 20px;
      }
      h1,
      h2,
      h3 {
        color: #333;
      }
      .important {
        color: #d9534f;
      }
      .footer {
        background-color: #f9f9f9;
        padding: 10px;
        text-align: center;
        font-size: 12px;
        color: #777;
      }
      a {
        color: #337ab7;
        text-decoration: none;
      }
      img {
        max-width: 100%;
        height: auto;
      }
      ul {
        list-style-type: none;
        padding: 0;
      }
      li {
        margin-bottom: 5px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1>🎅 Season's Greetings!</h1>
      </div>

      <!-- Main Content -->
      <div class="content">
        <p>Dear <strong>${displayName}</strong>,</p>

        <p>
          The moment you've been waiting for is here—you've been matched with
          your Secret Santa recipient for this year's gift exchange!
        </p>

        <h2>You will be gifting to:</h2>
        <h1><strong>${recipientName}</strong></h1>

        <hr />

        <h3 class="important">Important Reminders:</h3>
        <ul>
          <li>
            <strong>Keep it Secret:</strong> Part of the fun is the
            mystery—please keep your identity hidden until the reveal.
          </li>
          <li>
            <strong>Gift Guidelines:</strong> Ensure your gift aligns with our
            community guidelines and budget.
          </li>
          <li>
            <strong>Questions?</strong> Feel free to reply to this email or
            visit our <a href="#">FAQ page</a>.
          </li>
        </ul>

        <p>Wishing you a joyful gifting experience!</p>

        <p>
          Warm regards,<br />
          The Secret Santa Team
        </p>

        <!-- Logo (replace src with actual logo URL) -->
        <p>
          <img src="[Secret Santa Website Logo URL]" alt="Secret Santa Logo" />
        </p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>
          <strong>Connect with us:</strong>
          <a href="santa.pinthat.io">Website</a> |
        </p>
        <p>
          <em
            >Please do not share this email to maintain the surprise for
            everyone involved.</em
          >
        </p>
      </div>
    </div>
  </body>
</html>
`;
