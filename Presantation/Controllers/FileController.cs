using Microsoft.AspNetCore.Mvc;
using Services.Contracts;


namespace Presantation.Controllers
{
	[Route("api/services/[Controller]")]
	[ApiController]
	public partial class FileController : ControllerBase
	{
		private readonly IServiceManager _manager;

		public FileController(IServiceManager manager) =>
			_manager = manager;
	}
}
