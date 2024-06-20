using Temsa_Api.Extensions;

#region add extensions
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(typeof(Program).Assembly);
builder.Services.ConfigureAddControllers();
builder.Services.ConfigureAllManagers();
builder.Services.ConfigureServices();
builder.Services.ConfigureConfigModels(builder.Configuration);
builder.Services.ConfigureJwt(builder.Configuration);
builder.Services.ConfigureCORS();

var app = builder.Build();

builder.Services.ConfigureExceptionHandler(app);
#endregion

#region set production mode
if (app.Environment.IsProduction())
	app.UseHsts();
#endregion

#region add pipelines
app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
#endregion

app.Run();