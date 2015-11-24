using System.Linq;
using Microsoft.AspNet.Mvc;
using PhotoLibrary;
using PagedList;
using System.Threading.Tasks;
using Microsoft.Data.Entity;
using System;
using System.Collections.Generic;

namespace MVC6.Controllers
{
    public class HomeController : Controller
    {

        private readonly PhotoContext _context;
        public HomeController(PhotoContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index(MVC6RC1.Models.PhotoLibrary model)
        {
            model.photos = await Data(model.PageNumber);
            return View(model);
        }

        private async Task<IEnumerable<PhotoInfo>> Data(int pageNumber)
        {
            return await _context.PhotoInfos.OrderByDescending(p => p.date).Skip((pageNumber - 1) * 10).Take(10).ToListAsync();
        }

        public async Task<PartialViewResult> PartialLibrary(int pageNumber = 1)
        {
            return PartialView(await Data(pageNumber));
        }
        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            _context.Dispose();
        }
    }
}
