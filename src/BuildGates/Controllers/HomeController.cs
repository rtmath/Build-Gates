using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace BuildGates.Controllers
{
    public class HomeController : Controller
    {
        public const int NUMBER_OF_LEVELS = 5;
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult About()
        {
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }

        public IActionResult Play(int id)
        {
            if (id > 0 && id <= NUMBER_OF_LEVELS)
            {
                return View(ViewBag.LevelId = id);
            }
            else
            {
                return RedirectToAction("Error");
            }
        }
    }
}
