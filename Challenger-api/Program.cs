using Challenger_api.Data;
using Challenger_api.Routes;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<PersonContext>();

builder.Services.ConfigureHttpJsonOptions(options => {
    options.SerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
});

builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}



PersonRoutes.PersonRoute(app);
TransactionRoutes.TransactionRoute(app);

app.UseCors();
app.UseHttpsRedirection();
app.Run();