using PhotoLibrary;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Configuration;
using Microsoft.Data.Entity;
using Microsoft.Extensions.DependencyInjection;

namespace MVC5.Controllers
{
    public class HomeController : Controller
    {
        private readonly PhotoContext _context;


        public HomeController()
        {
            //Set up for DI later.  MVC6 should work on azure, but doesn't
            var services = new ServiceCollection();
            services.AddEntityFramework().AddSqlServer().AddDbContext<PhotoContext>(optionsBuilder =>
                                                optionsBuilder.
                                                    UseSqlServer(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString).
                                                    MigrationsAssembly("MVC6"));
             _context = services.BuildServiceProvider().GetService<PhotoContext>();
        }

        public ActionResult Index(Models.PhotoLibrary model)
        {
            return View(model);
        }

        private async Task<IEnumerable<PhotoInfo>> Data(int pageNumber)
        {
            return await _context.PhotoInfos.OrderByDescending(p => p.date).Skip((pageNumber - 1) * 11).Take(11).ToListAsync();
        }

        public async Task<PartialViewResult> PartialLibrary(int pageNumber)
        {
            return PartialView(new Models.PhotoLibrary { photos = await Data(pageNumber), PageNumber = pageNumber });
        }
        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            _context.Dispose();
        }
    }
}