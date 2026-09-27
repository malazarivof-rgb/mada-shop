 "use client";

import { useMemo, useState } from "react";
import {
  Search, ShoppingCart, User, Heart, ChevronRight, Star, MapPin,
  Truck, ShieldCheck, Store, LayoutDashboard, Package, TrendingUp,
  Menu, X, Minus, Plus, Trash2, ArrowRight, Bell, Settings, LogOut
} from "lucide-react";

type Product = {
  id: number; name: string; category: string; price: number; rating: number;
  reviews: number; city: string; image: string; seller: string;
};

const products: Product[] = [
  { id:1, name:"Samsung Galaxy A15", category:"Téléphones", price:620000, rating:4.8, reviews:120, city:"Antananarivo", image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80", seller:"Smart Store" },
  { id:2, name:"HP Portable 15", category:"Informatique", price:1250000, rating:4.9, reviews:60, city:"Antananarivo", image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80", seller:"Tech Store" },
  { id:3, name:"Montre Homme", category:"Mode", price:120000, rating:4.6, reviews:55, city:"Toamasina", image:"https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80", seller:"Fashion Store" },
  { id:4, name:"T-shirt Adidas", category:"Mode", price:45000, rating:4.7, reviews:62, city:"Antananarivo", image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80", seller:"Fashion Store" },
  { id:5, name:"Chaussures Nike", category:"Mode", price:250000, rating:4.8, reviews:91, city:"Antananarivo", image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80", seller:"Sports Shop" },
  { id:6, name:"Réfrigérateur", category:"Maison", price:1200000, rating:4.5, reviews:42, city:"Fianarantsoa", image:"https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=900&q=80", seller:"Home Plus" },
  { id:7, name:"Maquillage Kit", category:"Beauté", price:75000, rating:4.6, reviews:38, city:"Antananarivo", image:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80", seller:"Beauty Shop" },
  { id:8, name:"Riz local 25kg", category:"Alimentation", price:60000, rating:4.7, reviews:120, city:"Antsirabe", image:"https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80", seller:"Mada Agro" }
];

const cats = ["Tous", "Mode", "Téléphones", "Informatique", "Maison", "Beauté", "Alimentation", "Agriculture"];

function money(n:number){ return new Intl.NumberFormat("fr-FR").format(n) + " Ar"; }

export default function Home() {
  const [page, setPage] = useState<"home"|"shop"|"product"|"cart"|"dashboard">("home");
  const [selected, setSelected] = useState<Product>(products[1]);
  const [cart, setCart] = useState<{product:Product, qty:number}[]>([
    {product: products[1], qty:1},
    {product: products[4], qty:1},
    {product: products[3], qty:2}
  ]);
  const [category, setCategory] = useState("Tous");
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  const filtered = useMemo(() => products.filter(p =>
    (category==="Tous" || p.category===category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  ), [category, search]);

  const cartCount = cart.reduce((a,b)=>a+b.qty,0);
  const subtotal = cart.reduce((a,b)=>a+b.product.price*b.qty,0);
  const delivery = cart.length ? 10000 : 0;
  const total = subtotal + delivery;

  function addToCart(p:Product) {
    setCart(c => {
      const found=c.find(x=>x.product.id===p.id);
      if(found) return c.map(x=>x.product.id===p.id ? {...x, qty:x.qty+1}:x);
      return [...c,{product:p,qty:1}];
    });
  }
  function openProduct(p:Product){ setSelected(p); setPage("product"); window.scrollTo({top:0,behavior:"smooth"}); }

  return (
    <div className="app">
      <header className="header">
        <div className="container topbar">
          <button className="mobile-btn" onClick={()=>setMobileMenu(!mobileMenu)}>{mobileMenu?<X/>:<Menu/>}</button>
          <button className="logo" onClick={()=>setPage("home")}><span className="logo-mark">M</span><span>MADA <b>SHOP</b><small>Mividiana. Mivarotra. Mitombo.</small></span></button>
          <div className="search">
            <Search size={19}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher un produit, une catégorie, un vendeur..." />
            <button onClick={()=>setPage("shop")}><Search size={18}/></button>
          </div>
          <div className="header-actions">
            <button onClick={()=>setPage("dashboard")}><User size={20}/><span>Compte</span></button>
            <button onClick={()=>setPage("cart")} className="cart-btn"><ShoppingCart size={20}/><span>Panier</span>{cartCount>0&&<em>{cartCount}</em>}</button>
          </div>
        </div>
        <nav className={"nav "+(mobileMenu?"show":"")}>
          <div className="container nav-inner">
            <button className={page==="home"?"active":""} onClick={()=>setPage("home")}>Accueil</button>
            <button className={page==="shop"?"active":""} onClick={()=>setPage("shop")}>Boutique</button>
            <button onClick={()=>setPage("shop")}>Catégories</button>
            <button onClick={()=>setPage("dashboard")}>Devenir vendeur</button>
            <button>À propos</button>
          </div>
        </nav>
      </header>

      {page==="home" && <HomePage setPage={setPage} openProduct={openProduct} addToCart={addToCart}/>}
      {page==="shop" && <ShopPage category={category} setCategory={setCategory} filtered={filtered} openProduct={openProduct} addToCart={addToCart}/>}
      {page==="product" && <ProductPage product={selected} addToCart={addToCart} setPage={setPage}/>}
      {page==="cart" && <CartPage cart={cart} setCart={setCart} subtotal={subtotal} delivery={delivery} total={total} setPage={setPage}/>}
      {page==="dashboard" && <DashboardPage setPage={setPage}/>}

      <footer className="footer">
        <div className="container footer-grid">
          <div><div className="logo footer-logo"><span className="logo-mark">M</span><span>MADA <b>SHOP</b><small>Marketplace Madagascar</small></span></div><p>Une plateforme pour acheter et vendre plus simplement à Madagascar.</p></div>
          <div><h4>Marketplace</h4><a>Boutique</a><a>Catégories</a><a>Devenir vendeur</a></div>
          <div><h4>Assistance</h4><a>Centre d'aide</a><a>Livraison</a><a>Paiement</a></div>
          <div><h4>Vendeurs</h4><a>Ouvrir une boutique</a><a>Tarifs</a><a>Dashboard vendeur</a></div>
        </div>
        <div className="container copyright">© 2026 MADA SHOP — Tous droits réservés.</div>
      </footer>
    </div>
  );
}

function HomePage({setPage,openProduct,addToCart}:{setPage:any,openProduct:any,addToCart:any}) {
  return <main>
    <section className="hero"><div className="container hero-inner"><div className="hero-copy"><span className="eyebrow">🇲🇬 Marketplace Malagasy</span><h1>Achetez en ligne<br/><span>à Madagascar.</span></h1><p>Découvrez des produits auprès de vendeurs locaux, près de chez vous.</p><div className="hero-buttons"><button className="primary" onClick={()=>setPage("shop")}>Acheter maintenant <ArrowRight size={18}/></button><button className="secondary" onClick={()=>setPage("dashboard")}>Devenir vendeur</button></div></div><div className="hero-image"><img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85"/><div className="hero-card"><ShieldCheck size={20}/><div><b>Paiement sécurisé</b><small>Simple et fiable</small></div></div></div></div></section>
    <section className="container section"><div className="section-head"><div><span className="eyebrow blue">Explorer</span><h2>Catégories populaires</h2></div><button className="link-btn" onClick={()=>setPage("shop")}>Voir toutes <ChevronRight size={17}/></button></div><div className="categories">{cats.slice(1).map((c,i)=><button key={c} onClick={()=>setPage("shop")}><span className={"cat-icon c"+i}>{["👕","📱","💻","🛋️","💄","🛒","🌱"][i]}</span><b>{c}</b></button>)}</div></section>
    <section className="container section"><div className="section-head"><div><span className="eyebrow blue">Sélection</span><h2>Produits populaires</h2></div><button className="link-btn" onClick={()=>setPage("shop")}>Voir tout <ChevronRight size={17}/></button></div><div className="product-grid">{products.slice(0,4).map(p=><ProductCard key={p.id} p={p} open={openProduct} add={addToCart}/>)}</div></section>
    <section className="benefits"><div className="container benefits-grid"><Benefit icon={<Store/>} title="Produits locaux" text="Découvrez les vendeurs de Madagascar."/><Benefit icon={<Truck/>} title="Livraison" text="Des options adaptées à votre ville."/><Benefit icon={<ShieldCheck/>} title="Paiement sécurisé" text="Une expérience d'achat rassurante."/><Benefit icon={<Package/>} title="Suivi commande" text="Suivez votre commande facilement."/></div></section>
  </main>
}

function Benefit({icon,title,text}:{icon:any,title:string,text:string}){return <div className="benefit">{icon}<div><b>{title}</b><p>{text}</p></div></div>}

function ProductCard({p,open,add}:{p:Product,open:any,add:any}){return <article className="product-card"><button className="heart"><Heart size={17}/></button><button className="image-btn" onClick={()=>open(p)}><img src={p.image}/></button><div className="product-info"><span className="product-cat">{p.category}</span><h3 onClick={()=>open(p)}>{p.name}</h3><div className="rating"><Star size={14} fill="currentColor"/><b>{p.rating}</b><span>({p.reviews})</span></div><div className="price">{money(p.price)}</div><div className="location"><MapPin size={13}/>{p.city}</div><button className="add-btn" onClick={()=>add(p)}><ShoppingCart size={15}/> Ajouter au panier</button></div></article>}

function ShopPage({category,setCategory,filtered,openProduct,addToCart}:{category:string,setCategory:any,filtered:Product[],openProduct:any,addToCart:any}){return <main className="container shop-page"><div className="breadcrumbs">Accueil <ChevronRight size={14}/> Boutique</div><div className="shop-layout"><aside className="filters"><h3>Catégories</h3>{cats.map(c=><button key={c} className={category===c?"selected":""} onClick={()=>setCategory(c)}>{c}</button>)}<hr/><h3>Filtres</h3><label>Prix (Ar)</label><div className="price-inputs"><input placeholder="Min"/><input placeholder="Max"/></div><label>Localisation</label><select><option>Toutes les villes</option><option>Antananarivo</option><option>Toamasina</option><option>Antsirabe</option></select><label>Disponibilité</label><div className="check"><input type="checkbox"/> En stock uniquement</div><label>Note</label><div className="check"><input type="checkbox"/> ⭐⭐⭐⭐ et plus</div></aside><section className="catalog"><div className="catalog-head"><div><span className="eyebrow blue">Boutique</span><h1>Tous les produits <small>({filtered.length})</small></h1></div><select><option>Plus récents</option><option>Prix croissant</option><option>Prix décroissant</option></select></div><div className="product-grid">{filtered.map(p=><ProductCard key={p.id} p={p} open={openProduct} add={addToCart}/>)}</div></section></div></main>}

function ProductPage({product:p,addToCart,setPage}:{product:Product,addToCart:any,setPage:any}){return <main className="container product-page"><div className="breadcrumbs">Accueil <ChevronRight size={14}/> {p.category} <ChevronRight size={14}/> {p.name}</div><div className="product-detail"><div className="gallery"><img src={p.image}/><div className="thumbs"><img src={p.image}/><img src={p.image}/><img src={p.image}/></div></div><div className="detail-main"><span className="product-cat">{p.category}</span><h1>{p.name}</h1><div className="rating big"><Star size={18} fill="currentColor"/><b>{p.rating}</b><span>({p.reviews} avis)</span><span className="stock">● En stock</span></div><div className="detail-price">{money(p.price)}</div><p>Découvrez ce produit de qualité proposé par un vendeur local. Informations détaillées, commande simple et options de livraison adaptées.</p><ul className="specs"><li>✓ Produit vérifié</li><li>✓ Disponible immédiatement</li><li>✓ Livraison à Madagascar</li></ul><div className="qty"><span>Quantité</span><button>−</button><b>1</b><button>+</button></div><div className="detail-actions"><button className="primary" onClick={()=>addToCart(p)}><ShoppingCart size={18}/> Ajouter au panier</button><button className="buy" onClick={()=>{addToCart(p);setPage("cart")}}>Acheter maintenant</button></div></div><aside className="seller-box"><div className="seller-avatar"><Store/></div><div><b>{p.seller}</b><div className="rating"><Star size={13} fill="currentColor"/> 4.8 <span>(120 ventes)</span></div><small><MapPin size={12}/> {p.city}</small></div><button onClick={()=>setPage("shop")}>Voir la boutique</button><hr/><div className="mini-benefit"><Truck/> Livraison rapide</div><div className="mini-benefit"><ShieldCheck/> Paiement sécurisé</div></aside></div><div className="tabs"><b>Description</b><span>Caractéristiques</span><span>Avis clients ({p.reviews})</span><span>À propos du vendeur</span></div><div className="description"><h2>Description du produit</h2><p>Un produit adapté aux besoins quotidiens, avec une présentation claire et un parcours d'achat pensé pour les clients à Madagascar.</p></div></main>}

function CartPage({cart,setCart,subtotal,delivery,total,setPage}:{cart:{product:Product,qty:number}[],setCart:any,subtotal:number,delivery:number,total:number,setPage:any}){return <main className="container cart-page"><div className="breadcrumbs">Accueil <ChevronRight size={14}/> Panier</div><div className="section-head"><div><span className="eyebrow blue">Votre sélection</span><h1>Mon panier <small>({cart.reduce((a,b)=>a+b.qty,0)} articles)</small></h1></div></div><div className="cart-layout"><div className="cart-list">{cart.map(item=><div className="cart-row" key={item.product.id}><img src={item.product.image}/><div className="cart-product"><b>{item.product.name}</b><small>Vendeur : {item.product.seller}</small></div><strong>{money(item.product.price)}</strong><div className="qty"><button onClick={()=>setCart((c:any[])=>c.map(x=>x.product.id===item.product.id?{...x,qty:Math.max(1,x.qty-1)}:x))}>−</button><b>{item.qty}</b><button onClick={()=>setCart((c:any[])=>c.map(x=>x.product.id===item.product.id?{...x,qty:x.qty+1}:x))}>+</button></div><strong>{money(item.product.price*item.qty)}</strong><button className="delete" onClick={()=>setCart((c:any[])=>c.filter(x=>x.product.id!==item.product.id))}><Trash2 size={17}/></button></div>)}<button className="continue" onClick={()=>setPage("shop")}>← Continuer mes achats</button></div><aside className="summary"><h3>Récapitulatif</h3><div><span>Sous-total</span><b>{money(subtotal)}</b></div><div><span>Livraison</span><b>{money(delivery)}</b></div><hr/><div className="summary-total"><span>Total</span><b>{money(total)}</b></div><button className="primary full" onClick={()=>alert("Checkout à connecter au paiement dans la prochaine phase.")}>Passer la commande</button><small>🔒 Paiement sécurisé — vos informations sont protégées.</small></aside></div></main>}

function DashboardPage({setPage}:{setPage:any}){return <main className="dashboard-wrap"><aside className="side-nav"><div className="side-brand">MADA <b>SHOP</b><small>Espace vendeur</small></div><button className="side-active"><LayoutDashboard/> Dashboard</button><button><Package/> Produits</button><button><ShoppingCart/> Commandes</button><button><User/> Clients</button><button><TrendingUp/> Ventes</button><button><TrendingUp/> Statistiques</button><button><Store/> Boutique</button><button><Settings/> Paramètres</button><button className="logout"><LogOut/> Déconnexion</button></aside><section className="dash-main"><div className="dash-top"><div><span className="eyebrow blue">Espace vendeur</span><h1>Bonjour, Tech Store 👋</h1><p>Voici un aperçu de votre boutique.</p></div><div className="dash-actions"><Bell/><button onClick={()=>setPage("home")}>Voir le site</button></div></div><div className="stats"><Stat title="Produits" value="125" icon={<Package/>}/><Stat title="Commandes" value="32" icon={<ShoppingCart/>}/><Stat title="Ventes totales" value="1 800 000 Ar" icon={<TrendingUp/>}/><Stat title="Note moyenne" value="4.8" icon={<Star/>}/></div><div className="dash-grid"><div className="panel chart"><div className="panel-head"><h3>Ventes (Ar)</h3><select><option>Ce mois-ci</option></select></div><div className="fake-chart"><div className="line l1"/><div className="line l2"/><div className="line l3"/><svg viewBox="0 0 600 220" preserveAspectRatio="none"><path d="M0 185 C80 175 90 145 145 160 S220 105 275 130 S340 110 390 125 S445 65 505 90 S555 35 600 55" fill="none" stroke="currentColor" strokeWidth="5"/></svg></div></div><div className="panel orders"><div className="panel-head"><h3>Dernières commandes</h3><button>Voir toutes →</button></div>{[["#CMD-10025","Rado","1 600 000 Ar","En préparation"],["#CMD-10024","Rova","320 000 Ar","Livré"],["#CMD-10023","Mamy","780 000 Ar","Expédié"],["#CMD-10022","Andy","250 000 Ar","En attente"]].map(x=><div className="order-mini" key={x[0]}><span>{x[0]}</span><b>{x[1]}</b><span>{x[2]}</span><em>{x[3]}</em></div>)}</div></div></section></main>}

function Stat({title,value,icon}:{title:string,value:string,icon:any}){return <div className="stat"><div className="stat-icon">{icon}</div><div><span>{title}</span><b>{value}</b></div></div>}
