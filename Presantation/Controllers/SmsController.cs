using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text;

namespace Presantation.Controllers
{
    [Route("api/services/[Controller]")]
    [ApiController]
    public class SmsController : ControllerBase
    {
        [HttpPost("send/1_1")]
        public async Task<IActionResult> SendSms_1_1()
        {
            #region set http client
            var httpClient = new HttpClient();
            
            httpClient.BaseAddress = new Uri("https://localhost:7091");
            httpClient.DefaultRequestHeaders
                .Accept
                .Add(new MediaTypeWithQualityHeaderValue("application/soap+xml"));
            #endregion

            #region set string content
            var contentInXml = @$"
                <?xml version=""1.0"" encoding=""utf-8""?>
                <soap12:Envelope xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" 
                        xmlns:xsd=""http://www.w3.org/2001/XMLSchema"" 
                        xmlns:soap12=""http://www.w3.org/2003/05/soap-envelope"">
                  <soap12:Body>
                    <SmsInsert_1_N xmlns=""http://83.66.137.24/PgApiWs"">
                      <Username>Marubeni135</Username>
                      <Password>Marubeni246!</Password>
                      <SendDate>null</SendDate>
                      <ExpireDate>null</ExpireDate>
                      <Recepients>
                        <string>+905528093408</string>
                      </Recepients>
                      <Message>Deneme</Message>
                    </SmsInsert_1_N>
                  </soap12:Body>
                </soap12:Envelope>";

            var stringContent = new StringContent(
                contentInXml,
                Encoding.UTF8,
                "application/soap+xml");
            #endregion

            #region send sms
            var result = await httpClient.PostAsync(
                "http://otpsms.postaguvercini.com/api_ws/smsservice.asmx",
                stringContent);
            #endregion

            result.EnsureSuccessStatusCode();

            return Ok();
        }
    }
}
