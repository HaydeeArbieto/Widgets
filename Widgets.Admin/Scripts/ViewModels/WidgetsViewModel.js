function WidgetsViewModel() {
    var self = this;
    var apiHost = 'http://localhost:64588';

    self.Widgets = ko.observableArray();
    self.SelectedWidget = ko.observable();

    self.loadWidgets = function () {
        return $.get(apiHost + '/Widgets').done(function (widgets) {
            console.log('GetWidgets: ', widgets);
            self.Widgets(widgets);
        });
    }

    self.loadWidget = function (widget) {
        return $.get(apiHost + '/Widgets/' + widget.widgetId).done(function (widget) {
            console.log('Get one type: ', widget);
            self.SelectedWidget(ko.mapping.fromJS(widget));
        });
    }

    self.saveWidget = function () {
        $.post(apiHost + "/Widgets/" + self.SelectedWidget().WidgetId(),
            ko.mapping.toJS(self.SelectedWidget),
            function (result) {
                console.log('Return from save', result);
                alert("Saved!");
            },
            'json')
        .fail(function (xhr, status) { alert('Sorry, a problem has ocurred!'); });
    }

    self.deleteTrigger = function (trigger) {
        console.log('del tr', trigger);
        if (confirm('Are you sure you want to Delete a trígger?')) {
            var del = ko.utils.arrayFirst(self.SelectedWidget().Triggers(), function (trg) {
                return trg === trigger;
            });

            console.log('found', del);
            if (del) {
                self.SelectedWidget().Triggers.remove(del);
            }
        }
    }

    self.deleteRecurrence = function (recurrence) {
        if (confirm('Are you sure you want to Delete a recurrence?')) {
            var del = ko.utils.arrayFirst(self.SelectedWidget().Recurrences(), function (rec) {
                return rec === recurrence;
            });

            console.log('found', del);
            if (del) {
                self.SelectedWidget().Recurrences.remove(del);
            }
        }
    }

    self.deleteAudience = function (audiences) {
        if (confirm('Are you sure you want to Delete an audience?')) {
            var del = ko.utils.arrayFirst(self.SelectedWidget().Audiences(), function (audi) {
                return audi === audiences;
            });

            console.log('found', del);
            if (del) {
                self.SelectedWidget().Audiences.remove(del);
            }
        }
    }

}