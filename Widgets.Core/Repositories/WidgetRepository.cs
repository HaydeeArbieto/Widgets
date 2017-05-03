using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using Widgets.Core.Models;

namespace Widgets.Core.Repositories
{
    public class WidgetRepository
    {
        private const string dataFile = @"C:\Ungapped-Projects\Widgets\Widgets.Core\Data\Widgets.json";

        public List<Widget> LoadWidgets()
        {
            var json = File.ReadAllText(dataFile);
            var widgets = JsonConvert.DeserializeObject<List<Widget>>(json);
            return widgets;
        }

        public void SaveWidgets(List<Widget> widgets)
        {
            var data = JsonConvert.SerializeObject(widgets);

            File.WriteAllText(dataFile, data);
        }
    }
}
