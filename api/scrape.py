import vt


client = vt.Client("3480df0af8678f7e71c72bc119a4815ca6740222067fdb439569c9cfbb7b3454")

url_id = vt.url_id("http://www.virustotal.com")
url = client.get_object("/urls/{}", url_id)

print(url.last_analysis_stats)