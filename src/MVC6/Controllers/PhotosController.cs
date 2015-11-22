using PhotoLibrary;
using Microsoft.AspNet.Mvc;
using MVC6RC1.Controllers;
using PagedList;
using System.Linq;

namespace MVC6.Controllers
{
    public class PhotosController : Controller
    {
        private PhotoContext _context;

        public PhotosController(PhotoContext context)
        {
            _context = context;
        }

        public IActionResult Index(PhotosModel model)
        {
            var photos = _context.PhotoInfos.OrderByDescending(p => p.date).ToPagedList(model.PageNumber, 10);
            model.photos = model;
            return View(model);
        }
    }
}
