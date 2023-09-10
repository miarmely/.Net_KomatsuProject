using NLog;
using System.Reflection;
using Temsa_Web.Extensions;

#region setup logger
LogManager.Setup()
	.LoadConfigurationFromFile();
#endregion

#region add extensions
var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureAddControllersWithView();
builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());
builder.Services.ConfigureLoggerService();
builder.Services.ConfigureConfigModels();
builder.Services.ConfigureJwt(builder.Configuration);

var app = builder.Build();
#endregion

#region set production or staging mode 
if (!app.Environment.IsDevelopment())
	app.UseHsts();
#endregion

#region add pipelines
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
	name: "default",
	pattern: "{controller=User}/{action=Display}/{id?}");
#endregion

app.Run();