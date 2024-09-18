import { Component, OnInit, ElementRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-start-info-client',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './start-info-client.component.html',
  styleUrls: ['./start-info-client.component.css'],
  animations: [
    trigger('fadeInOnScroll', [
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      state('hidden', style({ opacity: 0, transform: 'translateY(50px)' })),
      transition('hidden => visible', animate('0.5s ease-out'))
    ])
  ]
})
export class StartInfoClientComponent implements OnInit {
  @ViewChild('missionVision', { static: false }) missionVisionRef!: ElementRef;
  @ViewChild('process', { static: false }) processRef!: ElementRef;
  @ViewChild('structure', { static: false }) structureRef!: ElementRef;

  mission = "Nuestra misión es proporcionar soluciones nutricionales personalizadas y de alta calidad para mejorar la salud y el bienestar de nuestros clientes, utilizando tecnología innovadora y asesoramiento experto.";
  vision = "Ser líderes en el campo de la nutrición digital, transformando vidas a través de una alimentación inteligente y hábitos saludables, y ser reconocidos globalmente por nuestra excelencia e innovación.";
  processSteps = [
    "Evaluación inicial personalizada",
    "Diseño de plan nutricional a medida",
    "Seguimiento continuo y ajustes",
    "Educación nutricional y apoyo",
    "Integración tecnológica para monitoreo"
  ];
  structureDepts = [
    "Dirección General",
    "Departamento de Nutrición",
    "Departamento de Tecnología",
    "Departamento de Atención al Cliente",
    "Departamento de Marketing y Ventas"
  ];

  missionVisionState = 'visible';
  processState = 'visible';
  structureState = 'visible';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('scroll', this.checkScroll, { passive: true });
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.checkScroll);
    }
  }

  checkScroll = () => {
    if (this.missionVisionRef) {
      this.missionVisionState = this.isElementInViewport(this.missionVisionRef.nativeElement) ? 'visible' : 'hidden';
    }
    if (this.processRef) {
      this.processState = this.isElementInViewport(this.processRef.nativeElement) ? 'visible' : 'hidden';
    }
    if (this.structureRef) {
      this.structureState = this.isElementInViewport(this.structureRef.nativeElement) ? 'visible' : 'hidden';
    }
  }

  isElementInViewport(el: any) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}