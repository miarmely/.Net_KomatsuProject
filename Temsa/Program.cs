using Temsa.Extensions;

#region add extensions
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.ConfigureRepositoryContext(builder.Configuration);
builder.Services.ConfigureRepositoryManager();
builder.Services.ConfigureServiceManager();
builder.Services.ConfigureUserSettingsConfig(builder.Configuration);
builder.Services.AddAutoMapper(typeof(Program).Assembly);

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
app.UseAuthorization();
app.MapControllerRoute(
	name: "default",
	pattern: "{controller=Home}/{action=Index}/{id?}");
#endregion

app.Run();
