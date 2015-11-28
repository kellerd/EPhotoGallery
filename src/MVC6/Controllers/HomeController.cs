

using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using PhotoLibrary;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace MVC6.Controllers
{
    public class HomeController : Controller
    {

        private readonly PhotoContext _context;

        public IConfigurationRoot Configuration { get; private set; }

        public HomeController(IConfigurationRoot Configuration)
        {
            this.Configuration = Configuration;
            //_context = context;
        }

        public IActionResult Index(Models.PhotoLibrary model)
        {
            return View(model);
        }

        private async Task<IEnumerable<PhotoInfo>> Data(int pageNumber)
        {
            return await _context.PhotoInfos.OrderByDescending(p => p.date).Skip((pageNumber - 1) * 11).Take(11).ToListAsync();
        }

        public async Task<PartialViewResult> PartialLibrary(int pageNumber = 1)
        {
            return PartialView( new Models.PhotoLibrary { photos = await Data(pageNumber), PageNumber = pageNumber + 1 });
        }
        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            //_context.Dispose();
        }
    }
}
