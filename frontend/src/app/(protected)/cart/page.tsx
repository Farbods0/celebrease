"use client";

import { getMyCarts, getMySubscription } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import CartDetails from "./cart-details";

export default function CartPage() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["carts"],
        queryFn: () => getMyCarts(),
    });

    const { data: subscription } = useQuery({
        queryKey: ["subscription", "me"],
        queryFn: () => getMySubscription(),
    });

    const isActiveSubscriber = subscription?.status === "ACTIVE";

    if (isLoading) {
        return (
            <div className="cb">
                <style>{`
                    .cb-cart-skeleton { animation: cb-pulse 1.6s ease-in-out infinite; background: linear-gradient(90deg, #f3e8ff 25%, #fce7f3 50%, #f3e8ff 75%); background-size: 200% 100%; border-radius: 18px; }
                    @keyframes cb-pulse { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
                `}</style>
                {/* Trust bar */}
                <div className="cb-trust-bar-cart" style={{background:"var(--cb-lavender)",borderBottom:"1px solid var(--cb-line)",height:"40px",display:"flex",alignItems:"center",justifyContent:"center",gap:"clamp(16px,3vw,40px)",fontSize:"13px",fontWeight:500,color:"var(--cb-ink-muted)",padding:"0 24px",flexWrap:"wrap"}}>
                    <span style={{display:"flex",alignItems:"center",gap:"6px",whiteSpace:"nowrap"}}>&#128666; <b style={{color:"var(--cb-purple)"}}>Free</b> shipping both ways</span>
                    <span style={{display:"flex",alignItems:"center",gap:"6px",whiteSpace:"nowrap"}}>&#128179; <b style={{color:"var(--cb-purple)"}}>100%</b> deposit refunded</span>
                </div>
                <div style={{maxWidth:"var(--cb-max)",margin:"0 auto",padding:"clamp(36px,4vw,56px) 24px 0"}}>
                    <div style={{height:"16px",width:"120px",marginBottom:"20px"}} className="cb-cart-skeleton" />
                    <div style={{height:"clamp(2rem,4.2vw,3rem)",width:"260px",marginBottom:"12px"}} className="cb-cart-skeleton" />
                    <div style={{height:"20px",width:"340px",marginBottom:"32px"}} className="cb-cart-skeleton" />
                </div>
                <div style={{maxWidth:"var(--cb-max)",margin:"0 auto",padding:"0 24px clamp(60px,8vw,100px)",display:"grid",gridTemplateColumns:"1fr 400px",gap:"32px",alignItems:"start"}}>
                    <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
                        {[0,1,2].map(i => (
                            <div key={i} style={{height:"160px",borderRadius:"22px"}} className="cb-cart-skeleton" />
                        ))}
                    </div>
                    <div style={{height:"480px",borderRadius:"22px"}} className="cb-cart-skeleton" />
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="cb">
                <div style={{maxWidth:"var(--cb-max)",margin:"48px auto",padding:"0 24px"}}>
                    <div style={{background:"var(--cb-lavender)",border:"1px solid var(--cb-line)",borderRadius:"var(--cb-r-card)",padding:"32px",textAlign:"center"}}>
                        <div style={{fontSize:"40px",marginBottom:"16px"}}>&#128533;</div>
                        <h2 style={{fontSize:"1.4rem",marginBottom:"10px"}}>Something went wrong</h2>
                        <p style={{color:"var(--cb-ink-muted)",fontSize:"15px",marginBottom:"24px"}}>We could not load your cart. Please try again later.</p>
                        <Link href="/shop-kits" className="btn-primary" style={{width:"auto",display:"inline-flex"}}>Browse Holiday Kits &#8594;</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!(data?.items ?? []).length) {
        return (
            <div className="cb">
                {/* Trust bar */}
                <div style={{background:"var(--cb-lavender)",borderBottom:"1px solid var(--cb-line)",height:"40px",display:"flex",alignItems:"center",justifyContent:"center",gap:"clamp(16px,3vw,40px)",fontSize:"13px",fontWeight:500,color:"var(--cb-ink-muted)",padding:"0 24px",flexWrap:"wrap"}}>
                    <span style={{display:"flex",alignItems:"center",gap:"6px",whiteSpace:"nowrap"}}>&#128666; <b style={{color:"var(--cb-purple)"}}>Free</b> shipping both ways</span>
                    <span style={{display:"flex",alignItems:"center",gap:"6px",whiteSpace:"nowrap"}}>&#128179; <b style={{color:"var(--cb-purple)"}}>100%</b> deposit refunded</span>
                </div>
                {/* Page header */}
                <div style={{maxWidth:"var(--cb-max)",margin:"0 auto",padding:"clamp(36px,4vw,56px) 24px 0"}}>
                    <nav aria-label="Breadcrumb" style={{fontSize:"13px",color:"var(--cb-ink-soft)",marginBottom:"6px"}}>
                        <Link href="/" style={{color:"var(--cb-purple)",fontWeight:600}}>Home</Link> &rsaquo; <Link href="/shop-kits" style={{color:"var(--cb-purple)",fontWeight:600}}>Catalog</Link> &rsaquo; Cart
                    </nav>
                    <h1 style={{fontSize:"clamp(2rem,4.2vw,3rem)",fontWeight:800,lineHeight:1.08,marginBottom:"10px",fontFamily:"'Playfair Display',Georgia,serif",color:"var(--cb-ink)"}}>Your celebration list</h1>
                </div>
                <div style={{maxWidth:"var(--cb-max)",margin:"0 auto",padding:"32px 24px clamp(60px,8vw,100px)"}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",padding:"clamp(60px,8vw,100px) 24px",border:"1px dashed rgba(155,47,201,0.2)",borderRadius:"var(--cb-r-lg)",background:"var(--cb-lavender)"}}>
                        <div style={{width:"80px",height:"80px",borderRadius:"50%",background:"var(--cb-gradient-soft)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"38px",marginBottom:"22px"}}>&#128713;</div>
                        <h2 style={{fontSize:"2rem",marginBottom:"12px",fontFamily:"'Playfair Display',Georgia,serif"}}>Your cart is empty</h2>
                        <p style={{color:"var(--cb-ink-muted)",fontSize:"16px",maxWidth:"360px",lineHeight:1.6,marginBottom:"28px"}}>Browse our holiday kits and add one to get started. Every kit includes free two way shipping and full deposit protection.</p>
                        <Link href="/shop-kits" className="btn-primary" style={{width:"auto"}}>Browse Holiday Kits &#8594;</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cb">
            {/* Trust bar */}
            <div style={{background:"var(--cb-lavender)",borderBottom:"1px solid var(--cb-line)",height:"40px",display:"flex",alignItems:"center",justifyContent:"center",gap:"clamp(16px,3vw,40px)",fontSize:"13px",fontWeight:500,color:"var(--cb-ink-muted)",padding:"0 24px",flexWrap:"wrap"}}>
                <span style={{display:"flex",alignItems:"center",gap:"6px",whiteSpace:"nowrap"}}>&#128666; <b style={{color:"var(--cb-purple)"}}>Free</b> shipping both ways</span>
                <span style={{display:"flex",alignItems:"center",gap:"6px",whiteSpace:"nowrap"}}>&#128179; <b style={{color:"var(--cb-purple)"}}>100%</b> deposit refunded</span>
                <span style={{display:"flex",alignItems:"center",gap:"6px",whiteSpace:"nowrap"}}>&#10005; <b style={{color:"var(--cb-purple)"}}>Cancel</b> anytime</span>
            </div>

            {/* Page header */}
            <div style={{maxWidth:"var(--cb-max)",margin:"0 auto",padding:"clamp(36px,4vw,56px) 24px 0"}}>
                <nav aria-label="Breadcrumb" style={{fontSize:"13px",color:"var(--cb-ink-soft)",marginBottom:"6px"}}>
                    <Link href="/" style={{color:"var(--cb-purple)",fontWeight:600}}>Home</Link> &rsaquo; <Link href="/shop-kits" style={{color:"var(--cb-purple)",fontWeight:600}}>Catalog</Link> &rsaquo; Cart
                </nav>
                <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:"16px",flexWrap:"wrap",marginBottom:"8px"}}>
                    <h1 style={{fontSize:"clamp(2rem,4.2vw,3rem)",fontWeight:800,lineHeight:1.08,fontFamily:"'Playfair Display',Georgia,serif",color:"var(--cb-ink)"}}>Your celebration list</h1>
                    <span aria-live="polite" style={{display:"inline-flex",alignItems:"center",gap:"7px",background:"var(--cb-gradient-soft)",border:"1px solid var(--cb-line)",color:"var(--cb-purple)",fontSize:"13px",fontWeight:700,padding:"6px 14px",borderRadius:"var(--cb-r-pill)",marginBottom:"6px"}}>
                        &#128717; {(data?.items ?? []).length} item{(data?.items ?? []).length === 1 ? "" : "s"} in your cart
                    </span>
                </div>
                <p style={{color:"var(--cb-ink-muted)",fontSize:"16px",marginTop:"10px",maxWidth:"560px"}}>Review your reservation. Your deposit is held safely and refunded in full after each kit is returned.</p>
            </div>

            {/* Main two-column layout */}
            <main style={{maxWidth:"var(--cb-max)",margin:"0 auto",padding:"32px 24px clamp(60px,8vw,100px)"}} className="cb-cart-layout">
                <CartDetails carts={data!.items} subscription={isActiveSubscriber ? subscription : null} />
            </main>
        </div>
    );
}
