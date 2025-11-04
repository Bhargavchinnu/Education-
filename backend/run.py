from app import create_app

if __name__ == "__main__":
    app = create_app()
    print("\n" + "="*80)
    print("🚀 Educational Recommender System - Backend Server")
    print("="*80)
    print("📍 Server: http://localhost:5000")
    print("📍 Health Check: http://localhost:5000/api/health")
    print("="*80)
    print("🔑 Default Credentials:")
    print("   Admin: admin / admin123")
    print("   Teacher: teacher1 / teacher123")
    print("   Student: student1 / student123")
    print("="*80 + "\n")
    app.run(debug=True, port=5000)
