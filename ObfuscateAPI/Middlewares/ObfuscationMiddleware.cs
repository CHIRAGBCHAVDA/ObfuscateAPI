
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.Security.Cryptography;
using System.Text;

namespace ObfuscateAPI.Middlewares;

public class ObfuscationMiddleware
{
    private readonly RequestDelegate _next;
    private const string Key = "ENCRYPTION_PASSPHRASE"; // Store it securely

    public ObfuscationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Path.StartsWithSegments("/api/x", out var remainingPath))
        {
            try
            {
                var encRoute = remainingPath.Value.TrimStart('/');
                var encIv = context.Request.Query["iv"];

                var decodedEncRoute = Uri.UnescapeDataString(encRoute);
                var decodedIv = Uri.UnescapeDataString(encIv);

                var decryptedPath = DecryptRoute(decodedEncRoute, decodedIv, Key);
                context.Request.Path = new PathString("/api/" + decryptedPath);

                var encQuery = context.Request.Query["enc"];

                if (!string.IsNullOrEmpty(encQuery))
                {
                    var decodedEncQuery = Uri.UnescapeDataString(encQuery);
                    var queryStringDecrypted = DecryptRoute(decodedEncQuery, decodedIv, Key);
                    context.Request.QueryString = new QueryString("?" + queryStringDecrypted);
                }
                else
                {
                    context.Request.QueryString = new QueryString();
                }

                // 🔐 If it's a POST request, try to decrypt the body too
                if (context.Request.Method == HttpMethods.Post && context.Request.ContentLength > 0)
                {
                    context.Request.EnableBuffering(); // Required to read stream multiple times

                    using var reader = new StreamReader(context.Request.Body, Encoding.UTF8, leaveOpen: true);
                    var encryptedBody = await reader.ReadToEndAsync();
                    context.Request.Body.Position = 0;

                    var decryptedJson = DecryptRoute(encryptedBody, decodedIv, Key);

                    // Replace body with decrypted content
                    var bytes = Encoding.UTF8.GetBytes(decryptedJson);
                    context.Request.Body = new MemoryStream(bytes);
                    context.Request.ContentLength = bytes.Length;
                }
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("Invalid encrypted request.");
                return;
            }
        }

        await _next(context);
    }

    private string DecryptRoute(string base64CipherText, string base64Iv, string key)
    {
        byte[] keyBytes = SHA256.HashData(Encoding.UTF8.GetBytes(key));
        byte[] ivBytes = Convert.FromBase64String(base64Iv);
        byte[] cipherBytes = Convert.FromBase64String(base64CipherText);

        using Aes aes = Aes.Create();
        aes.Key = keyBytes;
        aes.IV = ivBytes;
        aes.Mode = CipherMode.CBC;
        aes.Padding = PaddingMode.PKCS7;

        using var decryptor = aes.CreateDecryptor();
        using var memoryStream = new MemoryStream(cipherBytes);
        using var cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read);
        using var reader = new StreamReader(cryptoStream);

        return reader.ReadToEnd();
    }
}
