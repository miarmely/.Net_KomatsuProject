using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using Presantation.Attributes;

namespace Temsa_Web.Controllers
{
	[Authorization("User,Editor,Admin,Kullanıcı,Editör,Yönetici")]
	public class HomeController : Controller
	{
	}
}
