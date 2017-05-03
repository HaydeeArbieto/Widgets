using System;
using System.Web.Http;
using Widgets.Core.Models;
using System.Linq;
using Widgets.Core.Repositories;

namespace Widgets.Controllers
{
    [RoutePrefix("Widgets")]
    public class WidgetsController : ApiController
    {
        private WidgetRepository widgetsRepo = new WidgetRepository();
       
        [HttpGet]
        [Route("")]
        public IHttpActionResult GetWidgets()
        {
            var widgets = widgetsRepo.LoadWidgets();
            return Ok(widgets);
        }

        [HttpPost]
        [Route("")]
        public IHttpActionResult CreateWidget(Widget widget)
        {
            var widgets = widgetsRepo.LoadWidgets();
            widgets.Add(widget);

            var entity = new Widget();
            return Created<Widget>("/Widgets/" + entity.WidgetId, entity);
        }
      
        [HttpGet]
        [Route("{widgetId}")]
        public IHttpActionResult GetWidget(Guid widgetId)
        {
            var widgets = widgetsRepo.LoadWidgets();
            var widget = widgets.SingleOrDefault(w => w.WidgetId == widgetId);
            if (widget == null)
                return NotFound();

            return Ok(widget);
        }

        [HttpPost]
        [Route("{widgetId}")]
        public IHttpActionResult UpdateWidget(Guid widgetId, [FromBody]Widget widget)
        {
            var widgets = widgetsRepo.LoadWidgets();
            for (var i = 0; i < widgets.Count; i++)
            {
                if (widgets[i].WidgetId == widget.WidgetId)
                {
                    widgets[i] = widget;
                }
            }
            widgetsRepo.SaveWidgets(widgets);
            return Ok(widget);
        }
    }
}
