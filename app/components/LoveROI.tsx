// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Heart, Plus, ArrowLeft, Camera, X, Info, Target, Trash2, Upload, CheckCircle, AlertCircle, Edit2, ScanLine, Loader2 } from 'lucide-react';

// ▼▼▼ 新しく切り出したコンポーネント: AddDateModal ▼▼▼
const AddDateModal = ({ 
  isOpen, 
  onClose, 
  partnerId, 
  onAddDate,
  initialDate = new Date().toISOString().split('T')[0]
}: {
  isOpen: boolean;
  onClose: () => void;
  partnerId: string | number;
  onAddDate: (data: any) => void;
  initialDate?: string;
}) => {
  const [date, setDate] = useState(initialDate);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('食事');
  const [memo, setMemo] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  const photoInputRef = useRef(null);
  const ocrInputRef = useRef(null);

  const handleOCRScanMock = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setIsScanning(true);

    setTimeout(() => {
      setDate('2024-05-20');
      setAmount('8500');
      setCategory('食事');
      setMemo('イタリアンバル（AI読み取りテスト）');
      
      const reader = new FileReader();
      reader.onloadend = () => setPhotos((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);

      setIsScanning(false);
    }, 1500);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPhotos([...photos, reader.result]);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!amount) return;
    onAddDate({
      partnerId,
      date,
      amount: parseInt(amount, 10),
      category,
      memo,
      photos
    });
    setAmount('');
    setMemo('');
    setPhotos([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end z-50 animate-in fade-in duration-200 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A] rounded-t-3xl p-6 w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 border-t-2 border-[#FF006E]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">デート記録</h3>
          <div onClick={onClose} className="p-2 rounded-full cursor-pointer bg-[#3A3A3A] hover:bg-[#FF006E] transition-colors">
            <X size={24} className="text-white" />
          </div>
        </div>

        <div className="mb-6">
           <div 
             onClick={() => !isScanning && ocrInputRef.current.click()}
             className={`w-full py-4 bg-gradient-to-r from-[#FF006E] to-[#FF4D94] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#FF006E]/50 cursor-pointer transition-all ${isScanning ? 'opacity-70' : 'hover:shadow-xl hover:shadow-[#FF006E]/70 active:scale-95'}`}
           >
             {isScanning ? (
               <>
                 <Loader2 size={20} className="animate-spin" />
                 AI解析中...
               </>
             ) : (
               <>
                 <ScanLine size={20} />
                 レシート自動入力 (AI)
               </>
             )}
           </div>
           <p className="text-xs text-center text-gray-400 mt-2">※プレビュー版のため、写真はダミーデータとして解析されます</p>
           <input 
             ref={ocrInputRef} 
             type="file" 
             accept="image/*" 
             onChange={handleOCRScanMock} 
             style={{ display: 'none' }} 
           />
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-[#FF006E] ml-1 block mb-1 font-bold">日付</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-3 border border-[#3A3A3A] rounded-xl bg-[#2A2A2A] text-white focus:border-[#FF006E] focus:outline-none transition-colors" />
          </div>
          
          <div>
            <label className="text-xs text-[#FF006E] ml-1 block mb-1 font-bold">金額</label>
            <input type="number" placeholder="金額（円）" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-3 border border-[#3A3A3A] rounded-xl bg-[#2A2A2A] text-white placeholder-gray-500 focus:border-[#FF006E] focus:outline-none transition-colors" min="0" />
          </div>
          
          <div>
            <label className="text-xs text-[#FF006E] ml-1 block mb-1 font-bold">カテゴリー</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border border-[#3A3A3A] rounded-xl bg-[#2A2A2A] text-white focus:border-[#FF006E] focus:outline-none transition-colors">
              <option value="食事">食事</option>
              <option value="交通">交通</option>
              <option value="エンタメ">エンタメ</option>
              <option value="ギフト">ギフト</option>
              <option value="その他">その他</option>
            </select>
          </div>
          
          <textarea placeholder="メモ" value={memo} onChange={(e) => setMemo(e.target.value)} className="w-full p-3 border border-[#3A3A3A] rounded-xl bg-[#2A2A2A] text-white placeholder-gray-500 focus:border-[#FF006E] focus:outline-none transition-colors" rows="3" />
          
          {photos.length < 3 && (
            <div>
              <div onClick={() => photoInputRef.current.click()} className="flex items-center justify-center w-full p-8 border-2 border-dashed border-[#FF006E] border-opacity-30 rounded-xl cursor-pointer hover:bg-[#2A2A2A] hover:border-opacity-60 transition-all">
                <div className="text-center">
                  <Upload size={32} className="mx-auto mb-2 text-[#FF006E]" />
                  <span className="text-sm text-gray-400">写真を追加</span>
                </div>
              </div>
              <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
            </div>
          )}
          
          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {photos.map((photo, idx) => (
                <div key={idx} className="relative group">
                  <img src={photo} alt="preview" className="w-full h-24 object-cover rounded-lg shadow-sm border border-[#3A3A3A]" />
                  <div onClick={() => setPhotos(photos.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-[#FF006E] text-white p-1 rounded-full cursor-pointer shadow-md hover:bg-[#E6005F]">
                    <X size={14} />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div onClick={handleSubmit} className="w-full bg-gradient-to-r from-[#FF006E] to-[#FF4D94] text-white py-4 rounded-xl text-center font-bold shadow-lg shadow-[#FF006E]/50 cursor-pointer hover:shadow-xl hover:shadow-[#FF006E]/70 active:scale-95 transition-all mt-4">
            記録を保存
          </div>
          <div className="h-4"></div>
        </div>
      </div>
    </div>
  );
};

// ▼▼▼ メインコンポーネント: LoveROI ▼▼▼
const LoveROI = () => {
  const [partners, setPartners] = useState([]);
  const [dates, setDates] = useState([]);
  const [activeView, setActiveView] = useState('list');
  const [selectedPartner, setSelectedPartner] = useState(null);
  
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [showAddDate, setShowAddDate] = useState(false);
  const [showEditPartner, setShowEditPartner] = useState(false);
  const [showEditDate, setShowEditDate] = useState(false);
  const [editingDate, setEditingDate] = useState(null);
  
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  const [pName, setPName] = useState('');
  const [pGoal, setPGoal] = useState('');
  const [pMemo, setPMemo] = useState('');
  const [pPhoto, setPPhoto] = useState(null);
  const [pBudgetPerDate, setPBudgetPerDate] = useState('');
  const [pBudgetTotal, setPBudgetTotal] = useState('');
  const [pPhone, setPPhone] = useState('');

  const [dPartnerId, setDPartnerId] = useState('');

  const partnerPhotoInputRef = useRef(null);
  const editPhotoInputRef = useRef(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const showConfirm = (message, onConfirm) => {
    setConfirmDialog({ message, onConfirm });
  };

  useEffect(() => {
    const savedPartners = localStorage.getItem('loveroi_partners');
    const savedDates = localStorage.getItem('loveroi_dates');
    const hasSeenOnboarding = localStorage.getItem('loveroi_onboarding');
    
    if (!hasSeenOnboarding) setShowOnboarding(true);
    if (savedPartners) {
      try { setPartners(JSON.parse(savedPartners)); } catch (e) {}
    }
    if (savedDates) {
      try { setDates(JSON.parse(savedDates)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('loveroi_partners', JSON.stringify(partners));
  }, [partners]);

  useEffect(() => {
    localStorage.setItem('loveroi_dates', JSON.stringify(dates));
  }, [dates]);

  const triggerFileInput = (ref) => {
    if (ref && ref.current) ref.current.click();
  };

  const completeOnboarding = () => {
    localStorage.setItem('loveroi_onboarding', 'true');
    setShowOnboarding(false);
    setOnboardingStep(0);
  };

  const onboardingSteps = [
    { title: 'ラブROIへようこそ！', description: 'デートの費用を記録して、投資対効果を見える化しましょう', emoji: '💰' },
    { title: '相手を登録', description: '写真付きで相手を登録。目標も設定できます', emoji: '👤' },
    { title: 'デートを記録', description: '日付、金額、カテゴリを記録。レシートOCR機能も搭載！', emoji: '📝' },
    { title: '分析を確認', description: '総支出、平均単価、CPAなどの統計を確認できます', emoji: '📊' }
  ];

  const handlePartnerPhotoUpload = (e, type) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > 5000000) {
      showToast('画像は5MB以下にしてください');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'partner') {
        setPPhoto(reader.result);
        showToast('写真を選択しました');
      } else if (type === 'edit') {
        const newPhoto = reader.result;
        setPartners(partners.map(p => p.id === selectedPartner.id ? { ...p, photo: newPhoto } : p));
        setSelectedPartner({ ...selectedPartner, photo: newPhoto });
        showToast('写真を変更しました');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddPartner = () => {
    if (!pName || pName.trim() === '') {
      showToast('名前を入力してください');
      return;
    }
    setPartners([...partners, {
      id: Date.now(),
      name: pName.trim(),
      goal: pGoal.trim(),
      memo: pMemo.trim(),
      photo: pPhoto,
      phone: pPhone.trim(),
      budgetPerDate: pBudgetPerDate ? parseFloat(pBudgetPerDate) : null,
      budgetTotal: pBudgetTotal ? parseFloat(pBudgetTotal) : null,
      goalAchieved: false
    }]);
    setPName(''); setPGoal(''); setPMemo(''); setPPhoto(null); setPPhone('');
    setPBudgetPerDate(''); setPBudgetTotal('');
    setShowAddPartner(false);
    showToast('相手を追加しました');
  };

  const handleUpdatePartner = () => {
    if (!pName || pName.trim() === '') {
      showToast('名前を入力してください');
      return;
    }
    const updatedData = {
      name: pName.trim(),
      goal: pGoal.trim(),
      memo: pMemo.trim(),
      phone: pPhone.trim(),
      budgetPerDate: pBudgetPerDate ? parseFloat(pBudgetPerDate) : null,
      budgetTotal: pBudgetTotal ? parseFloat(pBudgetTotal) : null
    };
    
    setPartners(partners.map(p => p.id === selectedPartner.id ? { ...p, ...updatedData } : p));
    setSelectedPartner({ ...selectedPartner, ...updatedData });
    
    setPName(''); setPGoal(''); setPMemo(''); setPPhone(''); setPBudgetPerDate(''); setPBudgetTotal('');
    setShowEditPartner(false);
    showToast('情報を更新しました');
  };

  const openEditPartner = () => {
    setPName(selectedPartner.name);
    setPGoal(selectedPartner.goal);
    setPMemo(selectedPartner.memo);
    setPPhone(selectedPartner.phone || '');
    setPBudgetPerDate(selectedPartner.budgetPerDate ? selectedPartner.budgetPerDate.toString() : '');
    setPBudgetTotal(selectedPartner.budgetTotal ? selectedPartner.budgetTotal.toString() : '');
    setShowEditPartner(true);
  };

  const doDeletePartner = (id) => {
    const partnerToDelete = partners.find(p => p.id === id);
    if (!partnerToDelete) return;
    showConfirm(`${partnerToDelete.name}を削除しますか？`, () => {
      setPartners(partners.filter(p => p.id !== id));
      setDates(dates.filter(d => d.partnerId !== id));
      if (selectedPartner && selectedPartner.id === id) {
        setActiveView('list');
        setSelectedPartner(null);
      }
      showToast('削除しました');
    });
  };

  const handleAddDateFromModal = (newDateData) => {
    setDates([...dates, {
      id: Date.now(),
      partnerId: parseInt(newDateData.partnerId),
      date: newDateData.date,
      amount: parseInt(newDateData.amount, 10),
      category: newDateData.category,
      memo: newDateData.memo,
      photos: newDateData.photos
    }]);
    showToast('デート記録を追加しました');
  };

  const doDeleteDate = (id) => {
    showConfirm('このデート記録を削除しますか？', () => {
      setDates(dates.filter(d => d.id !== id));
      showToast('削除しました');
    });
  };

  const handleEditDate = (date) => {
    setEditingDate(date);
    setShowEditDate(true);
  };

  const handleUpdateDate = () => {
    if (!editingDate) return;
    setDates(dates.map(d => d.id === editingDate.id ? editingDate : d));
    setShowEditDate(false);
    setEditingDate(null);
    showToast('デート記録を更新しました');
  };

  const toggleGoal = (id) => {
    const partner = partners.find(p => p.id === id);
    setPartners(partners.map(p => p.id === id ? { ...p, goalAchieved: !p.goalAchieved } : p));
    if (partner && !partner.goalAchieved) {
      showToast('目標達成おめでとう！');
    }
  };

  const getPartnerStats = (partnerId) => {
    const partnerDates = dates.filter(d => d.partnerId === partnerId);
    const totalSpent = partnerDates.reduce((sum, d) => sum + d.amount, 0);
    const dateCount = partnerDates.length;
    const avgPerDate = dateCount > 0 ? totalSpent / dateCount : 0;
    const partner = partners.find(p => p.id === partnerId);
    const cpa = partner && partner.goalAchieved ? totalSpent : null;
    
    const advice = [];
    if (partner) {
      if (partner.budgetPerDate && avgPerDate > partner.budgetPerDate) {
        advice.push(`1回平均が予算¥${partner.budgetPerDate.toLocaleString()}を¥${Math.round(avgPerDate - partner.budgetPerDate).toLocaleString()}超過`);
      }
      if (partner.budgetTotal && totalSpent > partner.budgetTotal) {
        advice.push(`総予算¥${partner.budgetTotal.toLocaleString()}を¥${Math.round(totalSpent - partner.budgetTotal).toLocaleString()}超過`);
      }
      if (partner.budgetTotal && totalSpent > partner.budgetTotal * 0.8 && totalSpent <= partner.budgetTotal) {
        advice.push(`予算まで残り¥${Math.round(partner.budgetTotal - totalSpent).toLocaleString()}`);
      }
    }
    return { totalSpent, dateCount, avgPerDate, cpa, advice };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] pb-20 font-sans">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-[#FF006E] via-[#FF3D85] to-[#FF4D94] text-white p-6 shadow-2xl shadow-[#FF006E]/30">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-black bg-opacity-30 p-2 rounded-xl backdrop-blur-sm">
              <Heart size={28} fill="white" stroke="white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">ラブROI</h1>
              <p className="text-xs opacity-90 font-medium">恋愛の投資対効果、見える化</p>
            </div>
          </div>
          <div onClick={() => setActiveView('about')} className="p-2 bg-black bg-opacity-30 rounded-full cursor-pointer hover:bg-opacity-40 transition-all">
            <Info size={24} stroke="white" />
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] text-white px-6 py-3 rounded-full shadow-xl border-2 border-[#FF006E] flex items-center gap-2">
            <CheckCircle size={20} className="text-[#FF006E]" />
            <span className="font-medium">{toast}</span>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in">
          <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl p-6 max-w-sm w-full shadow-2xl border-2 border-[#FF006E]">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle size={24} className="text-[#FF006E]" />
              <h3 className="text-lg font-bold text-white">確認</h3>
            </div>
            <p className="text-gray-300 mb-6">{confirmDialog.message}</p>
            <div className="flex gap-3">
              <div onClick={() => setConfirmDialog(null)} className="flex-1 py-3 bg-[#3A3A3A] text-gray-300 rounded-xl text-center font-medium cursor-pointer hover:bg-[#4A4A4A]">
                キャンセル
              </div>
              <div onClick={() => { confirmDialog.onConfirm(); setConfirmDialog(null); }} className="flex-1 py-3 bg-gradient-to-r from-[#FF006E] to-[#FF4D94] text-white rounded-xl text-center font-medium cursor-pointer shadow-lg shadow-[#FF006E]/50">
                削除
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-gradient-to-br from-[#FF006E] via-[#1A1A1A] to-[#0A0A0A] flex items-center justify-center z-50 p-6">
          <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-[#FF006E]">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4 animate-bounce">{onboardingSteps[onboardingStep].emoji}</div>
              <h2 className="text-2xl font-bold text-white mb-3">{onboardingSteps[onboardingStep].title}</h2>
              <p className="text-gray-300 leading-relaxed">{onboardingSteps[onboardingStep].description}</p>
            </div>

            <div className="flex gap-2 justify-center mb-6">
              {onboardingSteps.map((_, idx) => (
                <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${idx === onboardingStep ? 'w-8 bg-[#FF006E]' : 'w-2 bg-[#3A3A3A]'}`} />
              ))}
            </div>

            <div className="flex gap-3">
              {onboardingStep > 0 && (
                <div onClick={() => setOnboardingStep(onboardingStep - 1)} className="flex-1 py-3 bg-[#3A3A3A] text-gray-300 rounded-xl text-center font-medium cursor-pointer hover:bg-[#4A4A4A]">
                  戻る
                </div>
              )}
              {onboardingStep < onboardingSteps.length - 1 ? (
                <div onClick={() => setOnboardingStep(onboardingStep + 1)} className="flex-1 py-3 bg-gradient-to-r from-[#FF006E] to-[#FF4D94] text-white rounded-xl text-center font-medium cursor-pointer shadow-lg shadow-[#FF006E]/50">
                  次へ
                </div>
              ) : (
                <div onClick={completeOnboarding} className="flex-1 py-3 bg-gradient-to-r from-[#FF006E] to-[#FF4D94] text-white rounded-xl text-center font-medium cursor-pointer shadow-lg shadow-[#FF006E]/50">
                  始める
                </div>
              )}
            </div>
            <div onClick={completeOnboarding} className="text-center mt-4 text-sm text-gray-400 cursor-pointer hover:text-gray-300">
              スキップ
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        {activeView === 'list' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">相手一覧</h2>
              <div onClick={() => setShowAddPartner(true)} className="bg-gradient-to-r from-[#FF006E] to-[#FF4D94] text-white p-3 rounded-full shadow-lg shadow-[#FF006E]/50 cursor-pointer hover:shadow-xl hover:shadow-[#FF006E]/70 transition-all transform hover:scale-105">
                <Plus size={24} />
              </div>
            </div>

            {partners.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl border-2 border-dashed border-[#FF006E] border-opacity-30">
                <Heart size={64} className="mx-auto mb-4 opacity-30" stroke="#FF006E" fill="none" />
                <p className="text-gray-400 mb-6">まだ相手が登録されていません</p>
                <div onClick={() => setShowAddPartner(true)} className="inline-block bg-gradient-to-r from-[#FF006E] to-[#FF4D94] text-white px-6 py-3 rounded-full cursor-pointer shadow-lg shadow-[#FF006E]/50 hover:shadow-xl hover:shadow-[#FF006E]/70">
                  最初の相手を追加
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {partners.map(partner => {
                  const stats = getPartnerStats(partner.id);
                  return (
                    <div key={partner.id} onClick={() => { setSelectedPartner(partner); setActiveView('detail'); }} className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl p-4 shadow-lg hover:shadow-2xl hover:shadow-[#FF006E]/20 transition-all cursor-pointer border border-[#3A3A3A] hover:border-[#FF006E]">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF006E] to-[#FF4D94] flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-[#3A3A3A] shadow-lg shadow-[#FF006E]/30">
                          {partner.photo ? <img src={partner.photo} alt={partner.name} className="w-full h-full object-cover" /> : <Heart size={28} fill="white" stroke="white" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-white">{partner.name}</h3>
                          <div className="flex gap-4 text-sm text-gray-400 mt-1">
                            <span className="bg-[#3A3A3A] px-2 py-0.5 rounded text-xs flex items-center gap-1">📅 {stats.dateCount}回</span>
                            <span className="bg-[#FF006E] text-white px-2 py-0.5 rounded text-xs flex items-center gap-1 font-bold">¥{stats.totalSpent.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="text-[#FF006E]">
                           <ArrowLeft size={20} className="transform rotate-180" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeView === 'detail' && selectedPartner && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div onClick={() => setActiveView('list')} className="p-2 rounded-full hover:bg-[#2A2A2A] cursor-pointer">
                <ArrowLeft size={24} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">詳細</h2>
            </div>

            <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl p-6 shadow-xl border border-[#3A3A3A]">
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <div 
                    onClick={() => triggerFileInput(editPhotoInputRef)}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF006E] to-[#FF4D94] flex items-center justify-center overflow-hidden cursor-pointer shadow-lg shadow-[#FF006E]/30 border-2 border-[#3A3A3A]"
                  >
                    {selectedPartner.photo ? <img src={selectedPartner.photo} alt={selectedPartner.name} className="w-full h-full object-cover" /> : <Heart size={36} fill="white" stroke="white" />}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#FF006E] text-white p-1.5 rounded-full border-2 border-[#1A1A1A] shadow-lg pointer-events-none">
                    <Camera size={12} />
                  </div>
                  <input ref={editPhotoInputRef} type="file" accept="image/*" onChange={(e) => handlePartnerPhotoUpload(e, 'edit')} style={{ display: 'none' }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1">{selectedPartner.name}</h3>
                  {selectedPartner.goal && (
                    <p className="text-sm text-gray-400 flex items-center gap-1 mb-2 bg-[#3A3A3A] inline-block px-2 py-1 rounded">
                      🎯 {selectedPartner.goal}
                    </p>
                  )}
                  {selectedPartner.phone && (
                    <div className="flex gap-2 mt-2">
                      <a href={`tel:${selectedPartner.phone}`} className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-opacity-30 transition-colors border border-green-500 border-opacity-30">
                        📞 電話
                      </a>
                      <a href={`sms:${selectedPartner.phone}`} className="px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-400 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-opacity-30 transition-colors border border-blue-500 border-opacity-30">
                        💬 SMS
                      </a>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <div onClick={openEditPartner} className="p-2 text-blue-400 bg-blue-500 bg-opacity-20 rounded-lg cursor-pointer hover:bg-opacity-30 border border-blue-500 border-opacity-30">
                    <Edit2 size={20} />
                  </div>
                  <div onClick={() => doDeletePartner(selectedPartner.id)} className="p-2 text-white bg-[#FF006E] rounded-lg cursor-pointer hover:bg-[#E6005F] shadow-lg shadow-[#FF006E]/30">
                    <Trash2 size={20} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#FF006E] rounded-xl p-4 border-2 border-[#FF4D94] shadow-lg shadow-[#FF006E]/30">
                  <div className="text-xs text-white mb-1 font-bold uppercase tracking-wider opacity-90">総支出</div>
                  <div className="text-2xl font-extrabold text-white">¥{getPartnerStats(selectedPartner.id).totalSpent.toLocaleString()}</div>
                </div>
                <div className="bg-[#3A3A3A] rounded-xl p-4 border border-[#4A4A4A]">
                  <div className="text-xs text-gray-400 mb-1 font-bold uppercase tracking-wider">デート回数</div>
                  <div className="text-2xl font-extrabold text-gray-300">{getPartnerStats(selectedPartner.id).dateCount}<span className="text-sm font-normal ml-1">回</span></div>
                </div>
                <div className="bg-blue-500 rounded-xl p-4 border-2 border-blue-400">
                  <div className="text-xs text-white mb-1 font-bold uppercase tracking-wider opacity-90">1回平均</div>
                  <div className="text-xl font-bold text-white">¥{Math.round(getPartnerStats(selectedPartner.id).avgPerDate).toLocaleString()}</div>
                </div>
                <div className="bg-green-500 rounded-xl p-4 border-2 border-green-400">
                  <div className="text-xs text-white mb-1 font-bold uppercase tracking-wider opacity-90">CPA (獲得単価)</div>
                  <div className="text-xl font-bold text-white">
                    {getPartnerStats(selectedPartner.id).cpa !== null ? `¥${getPartnerStats(selectedPartner.id).cpa.toLocaleString()}` : '-'}
                  </div>
                </div>
              </div>

              {getPartnerStats(selectedPartner.id).advice.length > 0 && (
                <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 border-opacity-30 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <div className="text-yellow-400 mt-0.5">💡</div>
                    <div className="flex-1">
                      <div className="font-bold text-yellow-400 mb-1 text-sm">ROIアドバイス</div>
                      {getPartnerStats(selectedPartner.id).advice.map((adv, idx) => (
                        <div key={idx} className="text-sm text-yellow-300 leading-snug mb-1">• {adv}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div onClick={() => toggleGoal(selectedPartner.id)} className={`w-full py-3 rounded-xl font-bold text-center cursor-pointer transition-all ${selectedPartner.goalAchieved ? 'bg-green-500 text-white shadow-lg' : 'bg-[#3A3A3A] text-gray-400 hover:bg-[#4A4A4A]'}`}>
                {selectedPartner.goalAchieved ? '✓ 目標達成済み (CPA確定)' : '目標を達成済みにする'}
              </div>

              <div 
                onClick={() => {
                  const stats = getPartnerStats(selectedPartner.id);
                  const shareText = `📊 私のラブROI結果\n\n💰 総支出：¥${stats.totalSpent.toLocaleString()}\n📅 デート回数：${stats.dateCount}回\n💝 1回平均：¥${Math.round(stats.avgPerDate).toLocaleString()}\n\nあなたの恋愛コスパは？\n#ラブROI #デート費用 #恋愛の見える化`;
                  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
                  window.open(url, '_blank');
                }}
                className="w-full py-3 bg-black border-2 border-[#FF006E] text-[#FF006E] rounded-xl font-bold text-center cursor-pointer hover:bg-[#FF006E] hover:text-white transition-all mt-3"
              >
                𝕏 でシェアする
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 mb-2">
              <h3 className="text-lg font-bold text-white">デート履歴</h3>
              <div 
                onClick={() => { 
                  setDPartnerId(selectedPartner.id);
                  setShowAddDate(true); 
                }} 
                className="bg-gradient-to-r from-[#FF006E] to-[#FF4D94] text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg shadow-[#FF006E]/50 cursor-pointer hover:shadow-xl hover:shadow-[#FF006E]/70 active:scale-95 transition-all"
              >
                <Plus size={18} /> 記録を追加
              </div>
            </div>

            <div className="space-y-3">
              {dates.filter(d => d.partnerId === selectedPartner.id).map(date => (
                <div key={date.id} className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl p-4 shadow-lg border border-[#3A3A3A]">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold bg-[#3A3A3A] px-2 py-1 rounded text-gray-400 uppercase">{date.category}</span>
                        <span className="text-sm font-medium text-gray-300">{date.date}</span>
                      </div>
                      {date.memo && <p className="text-sm text-gray-400 mt-1 bg-[#3A3A3A] p-2 rounded-lg inline-block">{date.memo}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-bold text-[#FF006E]">¥{date.amount.toLocaleString()}</div>
                      <div className="flex gap-1">
                        <div onClick={() => handleEditDate(date)} className="p-2 text-blue-400 hover:text-blue-300 rounded-lg cursor-pointer transition-colors">
                          <Edit2 size={18} />
                        </div>
                        <div onClick={() => doDeleteDate(date.id)} className="p-2 text-gray-500 hover:text-[#FF006E] rounded-lg cursor-pointer transition-colors">
                          <Trash2 size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                  {date.photos && date.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {date.photos.map((photo, idx) => <img key={idx} src={photo} alt="date" className="w-full h-20 object-cover rounded-lg shadow-sm border border-[#3A3A3A]" />)}
                    </div>
                  )}
                </div>
              ))}
              {dates.filter(d => d.partnerId === selectedPartner.id).length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  まだ記録がありません
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === 'about' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div onClick={() => setActiveView('list')} className="p-2 rounded-full hover:bg-[#2A2A2A] cursor-pointer">
                <ArrowLeft size={24} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">アプリについて</h2>
            </div>
            <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl p-6 shadow-lg border border-[#3A3A3A]">
              <h3 className="text-lg font-bold text-white mb-3">ラブROIとは？</h3>
              <p className="text-gray-300 leading-relaxed">デート費用を記録・分析し、恋愛の「投資対効果」を見える化する禁断の家計簿アプリです。</p>
            </div>

            <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-2xl p-6 shadow-lg border border-[#3A3A3A]">
              <h3 className="text-lg font-bold text-white mb-3">今後の予定</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-[#FF006E] font-bold">✓</span>
                  <span className="text-gray-300 font-medium">レシートOCR機能（UI実装完了）</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-600">□</span>
                  <span className="text-gray-400">AIアドバイザー機能（Gemini連携）</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-600">□</span>
                  <span className="text-gray-400">詳細なグラフ・分析機能</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-600">□</span>
                  <span className="text-gray-400">クラウド同期</span>
                </div>
              </div>
            </div>
            
            <div className="text-center text-xs text-gray-600 mt-8">
              LoveROI v2.0 (Pink Edition)
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add Partner */}
      {showAddPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-end z-50 animate-in fade-in duration-200">
          <div className="bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A] rounded-t-3xl p-6 w-full animate-in slide-in-from-bottom duration-300 border-t-2 border-[#FF006E]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">新規追加</h3>
              <div onClick={() => { setShowAddPartner(false); setPName(''); setPGoal(''); setPMemo(''); setPPhoto(null); }} className="p-2 rounded-full cursor-pointer hover:bg-[#3A3A3A]">
                <X size={24} className="text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <div onClick={() => triggerFileInput(partnerPhotoInputRef)} className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF006E] to-[#FF4D94] flex items-center justify-center overflow-hidden mb-3 cursor-pointer border-2 border-dashed border-[#FF006E] shadow-lg shadow-[#FF006E]/30">
                  {pPhoto ? <img src={pPhoto} alt="preview" className="w-full h-full object-cover" /> : <Camera size={32} className="text-white" />}
                </div>
                <div onClick={() => triggerFileInput(partnerPhotoInputRef)} className="text-sm text-[#FF006E] font-medium cursor-pointer">写真を選択</div>
                <input ref={partnerPhotoInputRef} type="file" accept="image/*" onChange={(e) => handlePartnerPhotoUpload(e, 'partner')} style={{ display: 'none' }} />
              </div>
              <input type="text" placeholder="名前" value={pName} onChange={(e) => setPName(e.target.value)} className="w-full p-3 border border-[#3A3A3A] rounded-xl bg-[#2A2A2A] text-white placeholder-gray-500 focus:border-[#FF006E] focus:outline-none transition-colors" />
              <input type="tel" placeholder="電話番号（任意）" value={pPhone} onChange={(e) => setPPhone(e.target.value)} className="w-full p-3 border border-[#3A3A3A] rounded-xl bg-[#2A2A2A] text-white placeholder-gray-500 focus:border-[#FF006E] focus:outline-none transition-colors" />
              <input type="text" placeholder="目標 (例: 付き合う、結婚)" value={pGoal} onChange={(e) => setPGoal(e.target.value)} className="w-full p-3 border border-[#3A3A3A] rounded-xl bg-[#2A2A2A] text-white placeholder-gray-500 focus:border-[#FF006E] focus:outline-none transition-colors" />
              <textarea placeholder="メモ" value={pMemo} onChange={(e) => setPMemo(e.target.value)} className="w-full p-3 border border-[#3A3A3A] rounded-xl bg-[#2A2A2A] text-white placeholder-gray-500 focus:border-[#FF006E] focus:outline-none transition-colors" rows="3" />
              
              <div className="border-t border-[#3A3A3A] pt-4 mt-2">
                <div className="text-sm font-bold text-[#FF006E] mb-3 flex items-center gap-1">💰 予算設定（任意）</div>
                <div className="grid grid-cols-2 gap-3">
                   <input type="number" placeholder="1回予算(円)" value={pBudgetPerDate} onChange={(e) => setPBudgetPerDate(e.target.value)} className="w-full p-3 border border-[#3A3A3A] rounded-xl bg-[#2A2A2A] text-white placeholder-gray-500 focus:border-[#FF006E] focus:outline-none transition-colors" min="0" />
                   <input type="number" placeholder="総予算(円)" value={pBudgetTotal} onChange={(e) => setPBudgetTotal(e.target.value)} className="w-full p-3 border border-[#3A3A3A] rounded-xl bg-[#2A2A2A] text-white placeholder-gray-500 focus:border-[#FF006E] focus:outline-none transition-colors" min="0" />
                </div>
              </div>
              <div className="flex gap-3">
                <div onClick={() => { setShowAddPartner(false); setPName(''); setPGoal(''); setPMemo(''); setPPhoto(null); setPPhone(''); setPBudgetPerDate(''); setPBudgetTotal(''); }} className="flex-1 py-3 bg-[#3A3A3A] text-gray-300 rounded-xl text-center font-medium cursor-pointer hover:bg-[#4A4A4A]">
                  キャンセル
                </div>
                <div onClick={handleAddPartner} className="flex-1 bg-gradient-to-r from-[#FF006E] to-[#FF4D94] text-white py-3 rounded-xl text-center font-bold shadow-lg shadow-[#FF006E]/50 cursor-pointer hover:shadow-xl hover:shadow-[#FF006E]/70">追加</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Partner */}
      {showEditPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-end z-50 animate-in fade-in">
          <div className="bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A] rounded-t-3xl p-6 w-full animate-in slide-in-from-bottom border-t-2 border-[#FF006E]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">編集</h3>
              <div onClick={() => { setShowEditPartner(false); setPName(''); setPGoal(''); setPMemo(''); }} className="p-2 rounded-full cursor-pointer hover:bg-[#3A3A3A]">
                <X size={24} className="text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="名前" value={pName} onChange={(e) => setPName(e.target.value)} className="w-full p-3 border border-[#3A3A3A] rounded-xl bg-[#2A2A2A] text-white placeholder-gray-500 focus:border-[#FF006E] focus:outline-none transition-colors" />
              <input type="tel" placeholder="電話番号" value={pPhone} onChange={(e) => setPPhone(e.target.value)} className="w-full p-3 border border-[#3A3A3A] rounded-xl bg-[#2A2A2A] text-white placeholder-gray-500 focus:border-[#FF006E] focus:outline-none transition-colors" />
              <input type="text" placeholder="目標" value={pGoal} onChange={(e) => setPGoal(e.target.value)} className="w-full p-3 border border-[#3A3A3A] rounded-xl bg-[#2A2A2A] text-white placeholder-gray-500 focus:border-[#FF006E] focus:outline-none transition-colors" />
              <textarea placeholder="メモ" value={pMemo} onChange={(e) => setPMemo(e.target.value)} className="w-full p-3 border border-[#3A3A3A] rounded-xl bg-[#2A2A2A] text-white placeholder-gray-500 focus:border-[#FF006E] focus:outline-none transition-colors" rows="3" />
              
              <div className="border-t border-[#3A3A3A] pt-4">
                <div className="text-sm font-bold text-[#FF006E] mb-3">💰 予算設定</div>
                <div className="grid grid-cols-2 gap-3">
                   <input type="number" placeholder="1回予算" value={pBudgetPerDate} onChange={(e) => setPBudgetPerDate(e.target.value)} className="w-full p-3 border border-[#3A3A3A] rounded-xl bg-[#2A2A2A] text-white placeholder-gray-500 focus:border-[#FF006E] focus:outline-none transition-colors" min="0" />
                   <input type="number" placeholder="総予算" value={pBudgetTotal} onChange={(e) => setPBudgetTotal(e.target.value)} className="w-full p-3 border border-[#3A3A3A] rounded-xl bg-[#2A2A2A] text-white placeholder-gray-500 focus:border-[#FF006E] focus:outline-none transition-colors" min="0" />
                </div>
              </div>
              
              <div onClick={handleUpdatePartner} className="w-full bg-gradient-to-r from-[#FF006E] to-[#FF4D94] text-white py-3 rounded-xl text-center font-bold shadow-lg shadow-[#FF006E]/50 cursor-pointer hover:shadow-xl hover:shadow-[#FF006E]/70">更新</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Date */}
      {showEditDate && editingDate && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-end z-50 animate-in fade-in">
          <div className="bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A] rounded-t-3xl p-6 w-full animate-in slide-in-from-bottom border-t-2 border-[#FF006E] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">記録を編集</h3>
              <div onClick={() => { setShowEditDate(false); setEditingDate(null); }} className="p-2 rounded-full cursor-pointer hover:bg-[#3A3A3A]">
                <X size={24} className="text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#FF006E] ml-1 block mb-1 font-bold">日付</label>
                <input 
                  type="date" 
                  value={editingDate.date} 
                  onChange={(e) => setEditingDate({...editingDate, date: e.target.value})} 
                  className="w-full p-3 border border-[#3A3A3A] rounded-xl bg-[#2A2A2A] text-white focus:border-[#FF006E] focus:outline-none transition-colors" 
                />
              </div>
              
              <div>
                <label className="text-xs text-[#FF006E] ml-1 block mb-1 font-bold">金額</label>
                <input 
                  type="number" 
                  placeholder="金額（円）" 
                  value={editingDate.amount} 
                  onChange={(e) => setEditingDate({...editingDate, amount: parseInt(e.target.value, 10) || 0})} 
                  className="w-full p-3 border border-[#3A3A3A] rounded-xl bg-[#2A2A2A] text-white placeholder-gray-500 focus:border-[#FF006E] focus:outline-none transition-colors" 
                  min="0" 
                />
              </div>
              
              <div>
                <label className="text-xs text-[#FF006E] ml-1 block mb-1 font-bold">カテゴリー</label>
                <select 
                  value={editingDate.category} 
                  onChange={(e) => setEditingDate({...editingDate, category: e.target.value})} 
                  className="w-full p-3 border border-[#3A3A3A] rounded-xl bg-[#2A2A2A] text-white focus:border-[#FF006E] focus:outline-none transition-colors"
                >
                  <option value="食事">食事</option>
                  <option value="交通">交通</option>
                  <option value="エンタメ">エンタメ</option>
                  <option value="ギフト">ギフト</option>
                  <option value="その他">その他</option>
                </select>
              </div>
              
              <textarea 
                placeholder="メモ" 
                value={editingDate.memo || ''} 
                onChange={(e) => setEditingDate({...editingDate, memo: e.target.value})} 
                className="w-full p-3 border border-[#3A3A3A] rounded-xl bg-[#2A2A2A] text-white placeholder-gray-500 focus:border-[#FF006E] focus:outline-none transition-colors" 
                rows="3" 
              />
              
              <div className="flex gap-3">
                <div onClick={() => { setShowEditDate(false); setEditingDate(null); }} className="flex-1 py-3 bg-[#3A3A3A] text-gray-300 rounded-xl text-center font-medium cursor-pointer hover:bg-[#4A4A4A]">
                  キャンセル
                </div>
                <div onClick={handleUpdateDate} className="flex-1 bg-gradient-to-r from-[#FF006E] to-[#FF4D94] text-white py-3 rounded-xl text-center font-bold shadow-lg shadow-[#FF006E]/50 cursor-pointer hover:shadow-xl hover:shadow-[#FF006E]/70">更新</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <AddDateModal 
        isOpen={showAddDate} 
        onClose={() => {
          setShowAddDate(false);
          setDPartnerId('');
        }}
        partnerId={dPartnerId}
        onAddDate={handleAddDateFromModal}
      />

    </div>
  );
};

export default LoveROI;