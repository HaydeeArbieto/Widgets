using System.Web.Mvc;
using Widgets.Core.Models;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Collections.Generic;
using Microsoft.Ajax.Utilities;

namespace Widgets.Controllers
{
    [RoutePrefix("Widgets")]
    public class WidgetsController : Controller
    {
        [Route("")]
        public ActionResult ShowWidgets()
        {
            return View("Widgets");
        }

        [Route("{widgetId}")]
        public ActionResult ShowEditWidget(Guid widgetId)
        {
            ViewBag.WidgetId = widgetId;
            return View("EditWidget");
        }
    }
}