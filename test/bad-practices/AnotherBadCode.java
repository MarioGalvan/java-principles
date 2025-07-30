public class AnotherBadCode {
    // Variable global pública - anti-patrón
    public static String globalVariable = "VERY_BAD";
    
    // Método con demasiados parámetros
    public void methodWithManyParameters(String a, String b, String c, String d, String e, String f, String g, String h) {
        System.out.println("Too many parameters");
    }
    
    // Método muy largo - code smell
    public void veryLongMethod() {
        System.out.println("Line 1");
        System.out.println("Line 2");
        System.out.println("Line 3");
        System.out.println("Line 4");
        System.out.println("Line 5");
        System.out.println("Line 6");
        System.out.println("Line 7");
        System.out.println("Line 8");
        System.out.println("Line 9");
        System.out.println("Line 10");
        System.out.println("Line 11");
        System.out.println("Line 12");
        System.out.println("Line 13");
        System.out.println("Line 14");
        System.out.println("Line 15");
    }
    
    // Método que retorna null - mala práctica
    public String getData() {
        return null;
    }
    
    // Método con nombre confuso
    public void doSomething() {
        // Este método hace muchas cosas diferentes
        System.out.println("Processing data");
        System.out.println("Saving to database");
        System.out.println("Sending email");
        System.out.println("Updating cache");
        System.out.println("Logging activity");
    }
} 