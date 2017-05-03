[
  {
      "widgetId": "72997ab8-6bde-443d-a00c-ffe855de973f",
      "name": "Subscription modal",
      "type": "Modal",
      "css": {
          "width": "400px",
          "height": "400px"
      },
      "backdropsCss": { "color": "rgba(126, 126, 126, 0.5)" },
      "contentUrl": "http://ui.mdlnk.se/Surveys/95d29dee-bf32-49ec-b0b7-c2e5f5ae47f5",
      "triggers": [
        {
            "type": "TimeOnPage",
            "time": "7"
        },
        {
            "type": "Url",
            "pattern": "/Ungapped-Widgets/index.html",
            "delay": 2
        },
        {
            "type": "Url",
            "pattern": "https://ungapped.com/"
        },
        {
            "type": "Url",
            "pattern": "https://ungapped.com/sv"
        },
        {
            "type": "Url",
            "pattern": "\\.*"
        },
        {
            "type": "Url",
            "pattern": "ungapped.com/$"
        },
        {
            "type": "Url",
            "pattern": "^https://"
        },
        {
            "type": "Url",
            "pattern": "\\?q=(.*)bil"
        },
        {
            "type": "Referrer",
            "pattern": "\\?q=(.*)flower",
            "delay": "2"
        },
        {
            "type": "Referrer",
            "pattern": "google(.*)#q=(.*)bil(.*)"
        },
        {
            "type": "TimeOnSite",
            "time": "5"
        },
        {
            "type": "ExitIntent"
        },
        {
            "type": "Scroll",
            "scroll": "15"
        },
        {
            "type": "ScrollIntoView",
            "selector": "#myFooter"
        }
      ],
      "recurrences": [
        { "type": "Page" },
        { "type": "Once" },
        { "type": "Repeat" },
        { "type": "Session" },
        {
            "type": "Expires",
            "days": "5",
            "hours": "0",
            "minutes": "0",
            "seconds": "0"
        }
      ],
      "audiences": [
        {
            "type": "UserAgent",
            "pattern": "Chrome"
        },
        { "type": "NewVisitor" },
        { "type": "ReturningVisitor" },
        { "type": "IsAnonymous" },
        { "type": "IsIdentified" }
      ]
  },
  {
      "widgetId": "41d46c21-ef98-46ae-91bf-d4af2ed431b7",
      "type": "CallOut",
      "name": "Discount 40%",
      "css": {
          "width": "300px",
          "height": "500px"
      },
      "position": { "right": "0" },
      "contentUrl": "https://app.ungapped.com/Account/Register?currency=SEK",
      "triggers": [
        {
            "type": "TimeOnPage",
            "time": "10"
        },
        {
            "type": "Url",
            "pattern": "/Ungapped-Widgets/index.html",
            "delay": "8"
        }
      ]
  },
  {
      "widgetId": "617cb3a5-51f6-4e24-8ba4-b71085b6fbc2",
      "type": "Banner",
      "name": "Contact banner",
      "css": { "height": "350px" },
      "position": { "bottom": "0px" },
      "contentUrl": "https://app.ungapped.com/Account/Register?currency=SEK",
      "triggers": [
        {
            "type": "Url",
            "pattern": "/Ungapped-Widgets/index.html",
            "delay": "3"
        }
      ]
  }
]