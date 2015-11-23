using PhotoLibrary;
using Microsoft.AspNet.Mvc;
using MVC6RC1.Controllers;
using PagedList;
using System.Linq;
using System;

namespace MVC6.Controllers
{
    public class PhotosController : Controller, IDisposable
    {

        private PhotoContext _context;

        public PhotosController(PhotoContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }
        [Produces("application/json")]
        public IActionResult Data(int id = 1)
        {
            return Json(_context.PhotoInfos.OrderByDescending(p => p.date).ToPagedList(id, 10));
        }
        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            _context.Dispose();
            _context = null;
        }
    }
}
