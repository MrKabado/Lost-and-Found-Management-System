<!DOCTYPE html>

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>

<body style="margin: 0; padding: 0; background-color: #f4f6fb; font-family: Arial, Helvetica, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f6fb; padding: 40px 15px;">
    <tr>
        <td align="center">

            <!-- Main Container -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">

                <!-- Header -->
                <tr>
                    <td align="center" style="background-color: #031079; padding: 30px 20px;">

                        <img
                            src="{{ $message->embed(public_path('images/cpc-logo.jpg')) }}"
                            alt="Cordova Public College Logo"
                            width="90"
                            height="90"
                            style="
                                display: block;
                                width: 90px;
                                height: 90px;
                                border-radius: 50%;
                                margin: 0 auto 15px;
                                background-color: #ffffff;
                            "
                        >

                        <h1 style="
                            margin: 0;
                            color: #ffffff;
                            font-size: 22px;
                            font-weight: bold;
                        ">
                            Lost &amp; Found Recovery System
                        </h1>

                        <p style="
                            margin: 8px 0 0;
                            color: #ffffff;
                            font-size: 14px;
                        ">
                            Cordova Public College
                        </p>

                    </td>
                </tr>

                <!-- Content -->
                <tr>
                    <td style="padding: 40px 35px;">

                        <h2 style="
                            margin: 0 0 15px;
                            color: #031079;
                            font-size: 24px;
                            text-align: center;
                        ">
                            Verify Your Email
                        </h2>

                        <p style="
                            margin: 0 0 10px;
                            color: #333333;
                            font-size: 15px;
                            line-height: 1.6;
                            text-align: center;
                        ">
                            Your verification code is:
                        </p>

                        <!-- OTP -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td align="center" style="padding: 20px 0;">

                                    <table cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                            <td style="
                                                background-color: #f0f3ff;
                                                border: 2px solid #031079;
                                                border-radius: 10px;
                                                padding: 15px 30px;
                                            ">
                                                <span style="
                                                    color: #031079;
                                                    font-size: 32px;
                                                    font-weight: bold;
                                                    letter-spacing: 8px;
                                                ">
                                                    {{ $otp }}
                                                </span>
                                            </td>
                                        </tr>
                                    </table>

                                </td>
                            </tr>
                        </table>

                        <p style="
                            margin: 10px 0 5px;
                            color: #555555;
                            font-size: 14px;
                            text-align: center;
                            line-height: 1.6;
                        ">
                            This verification code will expire in
                            <strong style="color: #031079;">5 minutes</strong>.
                        </p>

                        <p style="
                            margin: 20px 0 0;
                            color: #777777;
                            font-size: 13px;
                            text-align: center;
                            line-height: 1.6;
                        ">
                            If you did not request this verification code,
                            you can safely ignore this email.
                        </p>

                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td align="center" style="
                        background-color: #031079;
                        padding: 20px;
                    ">

                        <p style="
                            margin: 0;
                            color: #ffffff;
                            font-size: 12px;
                            line-height: 1.5;
                        ">
                            Lost &amp; Found Recovery System
                        </p>

                        <p style="
                            margin: 5px 0 0;
                            color: #ffffff;
                            font-size: 12px;
                        ">
                            Cordova Public College
                        </p>

                    </td>
                </tr>

            </table>

        </td>
    </tr>
</table>
</body>
</html>
