using NLog;
using Temsa.Extensions;

#region setup logger
LogManager.Setup()
	.LoadConfigurationFromFile();
#endregion

#region add extensions
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSwaggerGen();
builder.Services.ConfigureAddControllers();
builder.Services.AddAutoMapper(typeof(Program).Assembly);
builder.Services.ConfigureRepositoryContext(builder.Configuration);
builder.Services.ConfigureAllManagers();
builder.Services.ConfigureLoggerService();
builder.Services.ConfigureActionFilters();
builder.Services.ConfigureConfigModels(builder.Configuration);
builder.Services.ConfigureJwt(builder.Configuration);

var app = builder.Build();

builder.Services.ConfigureExceptionHandler(app);
#endregion

#region set production or staging mode 
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

else
	app.UseHsts();
#endregion

#region add pipelines
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
#endregion

app.Run();