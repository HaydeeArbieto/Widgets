
using System;
using System.Collections.Generic;
using System.ComponentModel;
namespace Widgets.Core.Models
{
    public class Widget
    {
        public Widget()
        {
            WidgetId = Guid.NewGuid();
        }

        public Guid WidgetId { get; set; }
        public string Name { get; set; }
        public WidgetType Type { get; set; }
        public Css Css { get; set; }
        public BackdropsCss BackdropsCss { get; set; }
        public String ContentUrl { get; set; }
        public List<Triggers> Triggers { get; set; }
        public List<Recurrences> Recurrences { get; set; }
        public List<Audiences> Audiences { get; set; }

    }
    public class Css
    {
        public String Width { get; set; }
        public string Height { get; set; }
    }
    public class BackdropsCss
    {
        public String Color { get; set; }
    }
    
    public class Triggers
    {
        public String Type { get; set; }
        public String Time { get; set; }
        public string Pattern { get; set; }
        public string Delay { get; set; }
        public string Scroll { get; set; }
        public string Selector { get; set; }
    }

    public class Recurrences
    {
        public String Type { get; set; }
        public int Days { get; set; }
        public int Hours { get; set; }
        public int minutes { get; set; }
        public int Seconds { get; set; }

    }

    public class Audiences
    {
        public String Type { get; set; }
        public string Pattern { get; set; }
    }
}