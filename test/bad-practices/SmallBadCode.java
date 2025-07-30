public class SmallBadCode {
    // Variable global pública - mala práctica
    public static String globalData = "BAD";
    
    // Método con demasiados parámetros
    public void badMethod(String a, String b, String c, String d, String e) {
        System.out.println("Too many parameters");
    }
    
    // Método que hace demasiadas cosas
    public void doEverything() {
        System.out.println("Doing task 1");
        System.out.println("Doing task 2");
        System.out.println("Doing task 3");
        System.out.println("Doing task 4");
        System.out.println("Doing task 5");
        System.out.println("Doing task 6");
        System.out.println("Doing task 7");
        System.out.println("Doing task 8");
        System.out.println("Doing task 9");
        System.out.println("Doing task 10");
    }
    
    // Método que retorna null
    public String getData() {
        return null;
    }
} 