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

#region set production and development mode 
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

else
{
	app.UseSwagger();
	app.UseSwaggerUI();
	app.UseHsts();
}   
#endregion

#region add pipelines
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
#endregion

app.Run();