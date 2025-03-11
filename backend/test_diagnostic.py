import requests
import json

def test_diagnostic():
    url = "http://localhost:8000/api/hybrid-food/diagnostic"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        data = response.json()
        print(json.dumps(data, indent=2))
        
        if data.get("status") == "online":
            print("\n✅ Il servizio è online!")
        else:
            print("\n❌ Il servizio ha riportato uno stato non online.")
    except Exception as e:
        print(f"\n❌ Errore durante il test: {str(e)}")

if __name__ == "__main__":
    print("Test dell'endpoint di diagnostica...\n")
    test_diagnostic()
