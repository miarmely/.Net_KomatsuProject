using Temsa_Api.Extensions;

#region add extensions
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSwaggerGen();
builder.Services.ConfigureAddControllers();
builder.Services.AddAutoMapper(typeof(Program).Assembly);
builder.Services.ConfigureAllManagers();
builder.Services.ConfigureServices();
builder.Services.ConfigureActionFilters();
builder.Services.ConfigureConfigModels(builder.Configuration);
builder.Services.ConfigureJwt(builder.Configuration);
builder.Services.ConfigureCORS();

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
app.UseCors("Temsa_Web");
#endregion

app.Run();