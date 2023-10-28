using Microsoft.AspNetCore.Mvc;
using Presantation.Attributes;

namespace Temsa_Web.Controllers
{
	[Authorization("User,Editor,Admin,Kullanıcı,Editör,Yönetici")]
	public class HomeController : Controller
	{
		
	}
}
