from django.db import models

class Livro(models.Model):
    titulo = models.CharField(max_length=200)
    autor = models.CharField(max_length=100)
    ano_publicacao = models.IntegerField()
    capa_url = models.URLField(blank=True, null=True)
    resumo = models.TextField(blank=True)
    pdf_url = models.URLField(blank=True, null=True, verbose_name="Link do PDF") 
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo

class Comentario(models.Model):
    livro = models.ForeignKey(Livro, on_delete=models.CASCADE, related_name='comentarios')
    usuario = models.CharField(max_length=100, default="Anônimo")
    texto = models.TextField()
    nota = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)]) 
    data = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario} - {self.livro.titulo}"