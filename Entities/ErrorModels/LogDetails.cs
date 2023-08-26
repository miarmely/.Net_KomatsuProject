using System.Reflection.Metadata.Ecma335;
using System.Security.Principal;

namespace Entities.ErrorModels
{
	public class LogDetails
	{
        public string FilterMethod{ get; set; }
		public string Controller { get; set; }
		public string Action{ get; set; }

        public int MyProperty { get; set; }

    }
}
