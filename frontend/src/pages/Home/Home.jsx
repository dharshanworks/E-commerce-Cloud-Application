import { Link } from "react-router-dom";

export const Home = () => (
  <div className="space-y-16">
    <style>{`
      @keyframes fadeUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes heroGradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      @keyframes float {
        0%,100%{
          transform:translateY(0px);
        }
        50%{
          transform:translateY(-18px);
        }
      }

      .fade-up{
        animation:fadeUp .7s ease forwards;
      }

      .float{
        animation:float 5s ease-in-out infinite;
      }

      .hero-bg{
        background-size:200% 200%;
        animation:heroGradient 12s ease infinite;
      }
    `}</style>

    {/* ================= HERO ================= */}

    <section
      className="hero hero-bg relative overflow-hidden rounded-3xl border border-base-300
      bg-gradient-to-r from-slate-900 via-neutral-900 to-slate-900
      py-28 text-white shadow-2xl"
    >
      {/* Background Blur Effects */}

      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-primary/20 blur-[120px]" />

      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-secondary/10 blur-[140px]" />

      <div className="hero-content flex-col gap-16 lg:flex-row-reverse">
        {/* Hero Illustration */}

        <div className="fade-up relative">
          <div className="float rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=700"
              alt="Shopping"
              className="w-[420px] rounded-2xl object-cover transition duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* Hero Text */}

        <div className="fade-up max-w-2xl">
          <div className="badge badge-primary badge-lg mb-5">
            ✨ Trusted by Thousands of Customers
          </div>

          <h1 className="mb-6 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-6xl font-black leading-tight text-transparent">
            Discover Premium Products With Confidence
          </h1>

          <p className="mb-8 text-lg leading-8 text-gray-300">
            Shop from thousands of carefully selected products with secure
            payments, lightning-fast delivery, and unbeatable customer support.
            Your next favorite purchase is just one click away.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/products"
              className="btn btn-primary btn-lg gap-3 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
            >
              🛒 Shop Now
            </Link>

            <Link
              to="/products"
              className="btn btn-outline btn-lg text-white hover:text-white"
            >
              Explore Products
            </Link>
          </div>

          {/* Stats */}

          <div className="mt-10 grid grid-cols-3 gap-6">
            <div>
              <h2 className="text-3xl font-bold">25K+</h2>
              <p className="text-sm text-gray-400">Products</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold">15K+</h2>
              <p className="text-sm text-gray-400">Customers</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold">4.9★</h2>
              <p className="text-sm text-gray-400">Customer Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ================= FEATURES ================= */}

    <section className="grid gap-8 md:grid-cols-3">
      {[
        {
          icon: "🚚",
          title: "Fast Delivery",
          text: "Quick nationwide delivery with real-time order tracking.",
        },
        {
          icon: "🛡️",
          title: "Quality Assured",
          text: "Every product is carefully verified before reaching you.",
        },
        {
          icon: "💳",
          title: "Secure Payments",
          text: "Protected checkout with trusted payment gateways.",
        },
      ].map((item, index) => (
        <div
          key={item.title}
          className="fade-up group card overflow-hidden border border-base-300 bg-base-100 transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-2xl"
          style={{
            animationDelay: `${index * 150}ms`,
          }}
        >
          <div className="card-body items-center text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-5xl transition duration-300 group-hover:scale-110 group-hover:bg-primary/20">
              {item.icon}
            </div>

            <h2 className="card-title text-2xl">{item.title}</h2>

            <p className="leading-7 text-base-content/70">{item.text}</p>
          </div>
        </div>
      ))}
    </section>

    {/* ================= WHY CHOOSE US ================= */}

    <section className="fade-up rounded-3xl border border-base-300 bg-base-200 p-12">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="mb-5 text-4xl font-bold">
            Why Shop With CloudCart?
          </h2>

          <p className="mb-8 leading-8 text-base-content/70">
            We combine premium quality, secure shopping, competitive pricing,
            and exceptional customer support to provide the best online shopping
            experience.
          </p>

          <div className="space-y-5">
            {[
              "✔ Free Shipping on Eligible Orders",
              "✔ Easy 30-Day Returns",
              "✔ 24/7 Customer Support",
              "✔ Secure Payment Protection",
            ].map((point) => (
              <div
                key={point}
                className="flex items-center gap-3 rounded-xl bg-base-100 p-4 shadow"
              >
                <span className="text-lg">{point}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700"
            alt="Products"
            className="rounded-3xl shadow-2xl transition duration-500 hover:scale-105"
          />
        </div>
      </div>
    </section>

    {/* ================= CTA ================= */}

    <section
      className="fade-up rounded-3xl border border-primary/20
      bg-gradient-to-r from-primary/10 via-base-200 to-primary/10
      p-14 text-center shadow-xl"
    >
      <h2 className="mb-5 text-5xl font-extrabold">
        Ready to Start Shopping?
      </h2>

      <p className="mx-auto mb-8 max-w-2xl text-lg leading-8 text-base-content/70">
        Explore thousands of products from trusted brands and enjoy secure
        shopping with fast delivery right to your doorstep.
      </p>

      <Link
        to="/products"
        className="btn btn-primary btn-lg gap-3 px-10 shadow-xl transition duration-300 hover:-translate-y-1 hover:scale-105"
      >
        🚀 View All Products
      </Link>
    </section>
  </div>
);