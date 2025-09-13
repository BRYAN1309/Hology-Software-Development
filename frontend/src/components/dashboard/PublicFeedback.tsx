import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  MapPin,
  Clock,
  ThumbsUp,
  AlertTriangle,
} from "lucide-react";

import { createFeedback, getFeedbacks } from "@/api/feedback";
import { Feedback } from "@/types/type";

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800";
    case "Medium":
      return "bg-yellow-100 text-yellow-800";
    case "Low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Under Review":
      return "bg-blue-100 text-blue-800";
    case "Acknowledged":
      return "bg-green-100 text-green-800";
    case "Responded":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "Laporan":
      return <AlertTriangle className="w-4 h-4" />;
    case "Feedback":
      return <ThumbsUp className="w-4 h-4" />;
    case "Pertanyaan":
      return <MessageSquare className="w-4 h-4" />;
    default:
      return <MessageSquare className="w-4 h-4" />;
  }
};

export const PublicFeedback = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Feedback>({
    nama: "",
    lokasi: "",
    subjek: "",
    pesan: "",
  });
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  // load feedback saat komponen mount
  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    const data = await getFeedbacks();
    setFeedbacks(data);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await createFeedback(formData);

    if (res.error) {
      alert("❌ Gagal: " + res.error);
    } else {
      alert("✅ Feedback berhasil dikirim!");
      setFormData({ nama: "", lokasi: "", subjek: "", pesan: "" });
      loadFeedbacks(); // refresh daftar feedback
    }

    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Form kirim feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Kirim Feedback & Laporan
          </CardTitle>
          <CardDescription>
            Laporkan penggunaan dana di daerah Anda atau berikan feedback untuk
            transparansi yang lebih baik
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nama">Nama (Opsional)</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Masukkan nama Anda"
                />
              </div>
              <div>
                <Label htmlFor="lokasi">Lokasi</Label>
                <Input
                  id="lokasi"
                  value={formData.lokasi}
                  onChange={handleChange}
                  placeholder="Kota/Kabupaten"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="subjek">Subjek</Label>
              <Input
                id="subjek"
                value={formData.subjek}
                onChange={handleChange}
                placeholder="Ringkasan singkat feedback/laporan Anda"
                required
              />
            </div>

            <div>
              <Label htmlFor="pesan">Pesan</Label>
              <Textarea
                id="pesan"
                value={formData.pesan}
                onChange={handleChange}
                placeholder="Jelaskan detail feedback atau laporan Anda..."
                className="min-h-[120px]"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Feedback"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Daftar feedback publik */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Feedback Publik Terbaru</CardTitle>
          <CardDescription>
            Feedback dan laporan dari masyarakat mengenai penggunaan dana publik
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedbacks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada feedback dari masyarakat.
              </p>
            ) : (
              feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        {getTypeIcon("Feedback")}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold">{fb.subjek}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>oleh {fb.nama || "Anonim"}</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {fb.lokasi}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {/* kalau backend simpan created_at bisa dipakai */}
                            {new Date().toLocaleDateString("id-ID")}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor("Medium")}>
                        Medium
                      </Badge>
                      <Badge className={getStatusColor("Acknowledged")}>
                        Acknowledged
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-foreground leading-relaxed pl-11">
                    {fb.pesan}
                  </p>

                  <div className="flex justify-between items-center pt-2 border-t pl-11">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <ThumbsUp className="w-4 h-4" />
                      0 orang menyukai ini
                    </div>
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Setuju
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
