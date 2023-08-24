using NLog;
using Temsa.Extensions;

#region setup logger
LogManager.Setup()
	.LoadConfigurationFromFile();
#endregion

#region add extensions
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddAutoMapper(typeof(Program).Assembly);
builder.Services.ConfigureRepositoryContext(builder.Configuration);
builder.Services.ConfigureRepositoryManager();
builder.Services.ConfigureServiceManager();
builder.Services.ConfigureUserSettingsConfig(builder.Configuration);
builder.Services.ConfigureLoggerService();

var app = builder.Build();

builder.Services.ConfigureExceptionHandler(app);
#endregion

#region set production or staging mode 
if (!app.Environment.IsDevelopment())
	app.UseHsts();
#endregion

#region add pipelines
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();
app.MapControllerRoute(
	name: "default",
	pattern: "{controller=Home}/{action=Index}/{id?}");
#endregion

app.Run();
