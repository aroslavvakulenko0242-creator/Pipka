using ИС1000.Services;

namespace ИС1000
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddSingleton(new DatabaseService("Dota2.db"));
            // Add services to the container.
            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();
            builder.Services.AddEndpointsApiExplorer();


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();

            // ============ ДОБАВЛЕННЫЕ СТРОКИ ============
            app.UseDefaultFiles(); // позволяет index.html быть страницей по умолчанию
            app.UseStaticFiles();  // разрешает доступ к статическим файлам из wwwroot
            // ============================================

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}