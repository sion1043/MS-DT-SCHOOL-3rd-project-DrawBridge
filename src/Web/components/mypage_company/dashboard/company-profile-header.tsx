import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Mail, Phone, MapPin, Calendar } from "lucide-react"

interface CompanyInfo {
  name: string
  industry: string
  tier: string
  xp: number
  email: string
  phone: string
  location: string
  founded: string
}

interface CompanyProfileHeaderProps {
  companyInfo: CompanyInfo
}

export function CompanyProfileHeader({ companyInfo }: CompanyProfileHeaderProps) {
  return (
    <div className="flex items-start gap-6">
      <Avatar className="w-20 h-20">
        <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl font-bold">
          {companyInfo.name.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-2xl font-bold text-gray-900">{companyInfo.name}</h3>
        </div>

        <p className="text-gray-600 mb-4">{companyInfo.industry}</p>

        <div className="flex items-center gap-2 mb-6">
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            {companyInfo.tier} 티어 {companyInfo.xp} XP
          </Badge>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>다음 레벨까지</span>
            <span>{companyInfo.xp} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${(companyInfo.xp % 1000) / 10}%` }}></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="w-4 h-4" />
            <span>{companyInfo.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{companyInfo.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{companyInfo.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>설립일: {companyInfo.founded}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
