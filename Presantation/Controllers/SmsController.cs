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

            #region populate headers
            httpClient.DefaultRequestHeaders.Add("Accept", "*/*");
			httpClient.DefaultRequestHeaders.Host = "www.postaguvercini.com";
            httpClient.DefaultRequestHeaders.Add(
                "SOAPAction",
                "http://83.66.137.24/PgApiWs/SmsInsert_1_N");
            #endregion

            #endregion

            #region set string content
            var contentInXml = $@"<?xml version=""1.0"" encoding=""utf-8""?>
                <soap:Envelope xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" xmlns:xsd=""http://www.w3.org/2001/XMLSchema"" xmlns:soap=""http://schemas.xmlsoap.org/soap/envelope/"">
                  <soap:Body>
                    <SmsInsert_1_N xmlns=""http://83.66.137.24/PgApiWs"">
                      <Username>Marubeni135</Username>
                      <Password>Marubeni246!</Password>
                      <SendDate>{null}</SendDate>
                      <ExpireDate>{null}</ExpireDate>
                      <Recepients>
                        <string>05528093408</string>
                      </Recepients>
                      <Message>Deneme</Message>
                    </SmsInsert_1_N>
                  </soap:Body>
                </soap:Envelope>";

            var stringContent = new StringContent(
                contentInXml,
                Encoding.UTF8,
				"text/xml");
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
