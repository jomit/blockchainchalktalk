using System;
using Workbench.Client;
using System.Linq;


namespace TestRestAPI
{
    class Program
    {
        static void Main(string[] args)
        {
            CallApi();
            Console.ReadKey();
        }

        static async void CallApi()
        {
            GatewayApi.SiteUrl = "https://jeth-4yj62z-api.azurewebsites.net/";
            var api = GatewayApi.Instance;
            api.SetAuthToken("eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjdfWnVmMXR2a3dMeFlhSFMzcTZsVWpVWUlHdyIsImtpZCI6IjdfWnVmMXR2a3dMeFlhSFMzcTZsVWpVWUlHdyJ9.eyJhdWQiOiJjY2Q5MGQ1Mi0zYzQ0LTRiY2YtODVjMS04YmNkMzFiZDFmNDgiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mYmZiYzYwYy04ZmM3LTQ4OWMtYjVmOS0xMjdhZTM5ODQzM2QvIiwiaWF0IjoxNTM1NTc5NTM1LCJuYmYiOjE1MzU1Nzk1MzUsImV4cCI6MTUzNTU4MzQzNSwiYWlvIjoiQVhRQWkvOElBQUFBMldoaDZyMEF2b1lTd3dYQndrQ3ZnUWZ3RVBwU2Q0MG1MS1lYc3oydERGWmNnb3d1eFh5Ly90Nk5Fdmk1VXFhTUFuK1Bla21DcU1Pck5lUnJBSlVnU1EyUWN6UXVmcmpPQTNTMlhkQTBjczNJM2huNitJdGhFNGpOOHQ3L2hQVDhpY0t0b2FWYjd6VFJCZVFiM1pKMzRBPT0iLCJhbXIiOlsicHdkIiwicnNhIl0sImVtYWlsIjoiam92YWdoQG1pY3Jvc29mdC5jb20iLCJmYW1pbHlfbmFtZSI6IlZhZ2hlbGEiLCJnaXZlbl9uYW1lIjoiSm9taXQiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaXBhZGRyIjoiNzMuNTkuMTA4LjE0OCIsIm5hbWUiOiJKb21pdCIsIm5vbmNlIjoiZGNmZDdhM2ItMDViZS00YzBlLTgxNzEtNzE1YmRjMjY3YmZmIiwib2lkIjoiYjEwZjU3ZDctZGJiNy00YzE3LWFlYmYtMzI5ODM5YmZmZWRjIiwicm9sZXMiOlsiQWRtaW5pc3RyYXRvciJdLCJzdWIiOiIzYWNQVXRzc1ZnRkxEUlpJZm9Rc3pCN1Q4YkFYUmNmcXBNR2F5RW1JYW00IiwidGlkIjoiZmJmYmM2MGMtOGZjNy00ODljLWI1ZjktMTI3YWUzOTg0MzNkIiwidW5pcXVlX25hbWUiOiJqb3ZhZ2hAbWljcm9zb2Z0LmNvbSIsInV0aSI6IjRRNW1vOF9LZ1VPMHhRSzk1MEEyQUEiLCJ2ZXIiOiIxLjAifQ.tMT_UskLocI7_euuTy_J08P6lCCn8__I_RpVf6Y1Ius07V1PbWQ5xZzCGWFH5p_JdeaNr3JzHhge447Rwr4vkRELSePF72KSZrp_DxpK2Q1fmz4-xxVPRqgQZJh7ZnzMjqVsg4KM8tysUV8PMu09ecuHM1sdMarhMdUpz9uZbZiLDq3CHqi1bedLVBTVap0qr4butmlwFAw55QxUSyfCPEd4yJxoWxQ0gs0oHPaSioRACXvX_3ruml_U1Gl2f29qz1nPP5GmcPKjbtx2iY3ffrZose3oI3zIc87kLmAXmUQWLnlupWpBrTFii1oJYqJwRbb1L9pkpvcYoRQPmN3lUg");

            var allconnections = await api.GetApplicationsAsync();

            foreach (var item in allconnections)
            {
                Console.WriteLine(item.DisplayName);
            }

            Console.WriteLine(allconnections.Count());
        }
    }
}
