namespace Challenger_api.Models;

public class Person
{
    public Person(string name, int age)
    {
        id = Guid.NewGuid();
        this.name = name;
        this.age = age;
    }
    public Guid id { get; init; }
    public string name { get; private set; }
    public int age { get; set; }
}