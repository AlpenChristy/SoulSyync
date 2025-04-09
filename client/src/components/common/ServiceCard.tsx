import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Service } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <div className="service-card bg-white rounded-xl shadow-md overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img 
          className="w-full h-full object-cover" 
          src={service.imageUrl || "https://images.pexels.com/photos/6541343/pexels-photo-6541343.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} 
          alt={service.name}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-heading font-semibold text-slate-800">{service.name}</h3>
        <p className="mt-2 text-slate-600">{service.description}</p>
        <div className="mt-4 flex items-center">
          <span className="text-primary-600 font-semibold">{formatCurrency(service.price)}</span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-slate-600">{service.duration} minutes</span>
        </div>
        <Link href={`/booking?service=${service.id}`}>
          <Button className="mt-4 w-full">
            Book Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
